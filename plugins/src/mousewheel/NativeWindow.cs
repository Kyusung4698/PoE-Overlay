using System;
using overwolf.plugins.mousewheel.Models;

namespace overwolf.plugins.mousewheel
{
  internal class NativeWindow
  {
    private InputOptionsWinInfo _winInfo;

    /// <summary>
    /// 
    /// </summary>
    /// <param name="info"></param>
    public void SetWindowInfo(InputOptionsWinInfo info)
    {
      _winInfo = info;
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="info"></param>
    public bool IsWindowInForeground()
    {
      var hWnd = GetForegroundWindow();
      var hWndFind = FindWindow();

      if (hWndFind == IntPtr.Zero)
      {
        return false;
      }

      return hWnd == hWndFind;
    }

    /// <summary>
    /// 
    /// </summary>
    /// <returns></returns>
    public IntPtr FindWindow()
    {
      if ((_winInfo == null) || (string.IsNullOrEmpty(_winInfo.winTitle)))
      {
        return IntPtr.Zero;
      }

      var hWnd = PInvoke.Functions.FindWindow(_winInfo.winClassname, _winInfo.winTitle);
      return hWnd;
    }

    /// <summary>
    /// 
    /// </summary>
    /// <returns></returns>
    private static IntPtr GetForegroundWindow()
    {
      var hWnd = PInvoke.Functions.GetForegroundWindow();
      return hWnd;
    }
  }
}
