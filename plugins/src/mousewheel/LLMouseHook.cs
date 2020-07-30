using System;
using System.Runtime.InteropServices;
using System.Threading;
using overwolf.plugins.mousewheel.Models;
using static overwolf.plugins.mousewheel.PInvoke.Constants;
using static overwolf.plugins.mousewheel.PInvoke.Functions;

namespace overwolf.plugins.mousewheel
{
  internal class LLMouseHook
  {
    /// <summary>
    /// Return true if you want the Wheel event to be blocked, otherwise false
    /// </summary>
    public delegate bool WheelEventHandler(InputOptionsInfo info);
    public event WheelEventHandler WheelInputEvent;

    private const string KLlHookThreadName = "LLHookThread";

    private Thread _messageLoopThread;
    private readonly MessageLoop _messageLoop = new MessageLoop();
    private readonly HookProc _llHookProc;
    private IntPtr _hMouseHook = IntPtr.Zero;

    /// <summary>
    /// 
    /// </summary>
    public LLMouseHook()
    {
      _llHookProc = LowLevelMouseProc;
    }

    /// <summary>
    /// 
    /// </summary>
    public bool Start()
    {
      Stop();

      // We run this on another thread because the Overwolf app's process
      // doesn't have a message loop (which is required for the hook)
      _messageLoopThread = new Thread(this.ThreadProc)
      {
        Name = KLlHookThreadName
      };
      _messageLoopThread.Start();

      // A bit of an assumption here... thinking it will take, no longer, than
      // 200 milliseconds for the thread to exit in case we fail to hook.
      _messageLoopThread.Join(200);

      return _messageLoopThread.IsAlive;
    }

    /// <summary>
    /// 
    /// </summary>
    public void Stop()
    {
      if ((_messageLoopThread == null) || (!_messageLoopThread.IsAlive))
      {
        return;
      }

      _messageLoop.Quit();
      if (!_messageLoopThread.Join(1000))
      {
#if DEBUG
        Debugger.Break();
#endif
      }
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="code"></param>
    /// <param name="wParam"></param>
    /// <param name="lParam"></param>
    /// <returns></returns>
    private int LowLevelMouseProc(int code, IntPtr wParam, IntPtr lParam)
    {
      if (code < 0 || code != HC_ACTION)
      {
        //you need to call CallNextHookEx without further processing
        //and return the value returned by CallNextHookEx
        return CallNextHookEx(_hMouseHook, code, wParam, lParam);
      }

      if (WheelInputEvent == null)
      {
        return CallNextHookEx(_hMouseHook, code, wParam, lParam);
      }

      var mouseLowLevelHook =
        (MSLLHOOKSTRUCT)Marshal.PtrToStructure(lParam, typeof(MSLLHOOKSTRUCT));

      var info = ExtractInfo(mouseLowLevelHook);
      if (!info.wheelUp && !info.wheelDown)
      {
        return CallNextHookEx(_hMouseHook, code, wParam, lParam);
      }

      return WheelInputEvent(info) ? 1 : CallNextHookEx(_hMouseHook, code, wParam, lParam);
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="mouseLowLevelHook"></param>
    /// <returns></returns>
    private InputOptionsInfo ExtractInfo(MSLLHOOKSTRUCT mouseLowLevelHook)
    {
      var info = new InputOptionsInfo();

      int delta = ((short)(mouseLowLevelHook.mouseData >> 16));
      info.wheelUp = (delta == 120);
      info.wheelDown = (delta == -120);

      if (!info.wheelUp && !info.wheelDown)
      {
        return info;
      }

      info.controlPressed =
        (GetKeyState(VirtualKeyStates.VK_CONTROL) & 0x8000) > 0;

      info.shiftPressed =
        (GetKeyState(VirtualKeyStates.VK_SHIFT) & 0x8000) > 0;

      return info;
    }

    /// <summary>
    /// 
    /// </summary>
    private void ThreadProc()
    {
      _hMouseHook = SetWindowsHookEx(HookType.WH_MOUSE_LL,
                                     _llHookProc,
                                     IntPtr.Zero,
                                     0);

      if (_hMouseHook == IntPtr.Zero)
      {
        return;
      }

      _messageLoop.Run();

      UnhookWindowsHookEx(_hMouseHook);
    }
  }
}
