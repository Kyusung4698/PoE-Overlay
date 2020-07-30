using System;
using Newtonsoft.Json;
using overwolf.plugins.mousewheel.Models;

namespace overwolf.plugins.mousewheel
{
  public class Plugin : IDisposable
  {
    private InputOptions _inputHookOptions = null;
    private NativeWindow _nativeWindow = new NativeWindow();
    private LLMouseHook _llMouseHook = new LLMouseHook();

    public event Action<object> onMouseWheelBlocked = null;

    /// <summary>
    /// Set the global options to be used by |start| and |sendWheel|
    /// </summary>
    /// <param name="options"></param>
    /// <param name="callback"></param>
    public void setOptions(string options, Action<object> callback)
    {
      _inputHookOptions = null;

      try
      {
        _inputHookOptions = JsonConvert.DeserializeObject<InputOptions>(
          options);

        _nativeWindow.SetWindowInfo(_inputHookOptions.windowInfo);

        _llMouseHook.WheelInputEvent -= OnllMouseHook_WheelInputEvent;
        _llMouseHook.WheelInputEvent += OnllMouseHook_WheelInputEvent;
      }
      catch (Exception)
      {
        callback(new
        {
          success = false,
          error = "Couldn't parse options!"
        });

        return;
      }

      callback(new
      {
        success = true
      });
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="options">See |Models.InputOptions|</param>
    /// <param name="callback"></param>
    public void start(Action<object> callback)
    {
      if (_inputHookOptions == null)
      {
        callback(new
        {
          success = false,
          error = "Missing options! Don't forget to call setOptions"
        });

        return;
      }

      if (!_llMouseHook.Start())
      {
        callback(new
        {
          success = false,
          error = "Failed setting hook"
        });

        return;
      }

      callback(new
      {
        success = true
      });
    }

    /// <summary>
    /// 
    /// </summary>
    public void stop()
    {
      _llMouseHook.Stop();
    }

    /// <summary>
    /// 
    /// </summary>
    public void Dispose()
    {
      _llMouseHook.WheelInputEvent -= OnllMouseHook_WheelInputEvent;
    }

    /// <summary>
    /// This is called on another thread
    /// </summary>
    /// <param name="info"></param>
    /// <returns></returns>
    private bool OnllMouseHook_WheelInputEvent(InputOptionsInfo info)
    {
      if (_inputHookOptions == null)
      {
        return false;
      }

      lock (this)
      {
        if (!_nativeWindow.IsWindowInForeground() || !ShouldBlockWheel(info))
        {
          return false;
        }

        // TODO: Consider running this callback on a separate thread
        // so that the input doesn't become laggy
        onMouseWheelBlocked?.Invoke(info);
        return true;
      }
    }

    // -------------------------------------------------------------------------
    private bool ShouldBlockWheel(InputOptionsInfo info)
    {
      var options = _inputHookOptions.inputInfo;
      if ((!options.wheelDown || !info.wheelDown) && (!options.wheelUp || !info.wheelUp))
      {
        return false;
      }
      return options.controlPressed == info.controlPressed &&
             options.shiftPressed == info.shiftPressed;
    }
  }
}
