using System;
using static overwolf.plugins.mousewheel.PInvoke.Functions;

namespace overwolf.plugins.mousewheel {
  internal class MessageLoop {
    private uint _threadId;

    /// <summary>
    /// 
    /// </summary>
    public void Run() {
      _threadId = GetCurrentThreadId();

      int ret;
      while ((ret = GetMessage(out var msg, IntPtr.Zero, 0, 0)) != 0)
      {
        if (ret == -1) {
          break;
        }

        TranslateMessage(ref msg);
        DispatchMessage(ref msg);
      }

      _threadId = 0;
    }

    /// <summary>
    /// 
    /// </summary>
    public void Quit() {
      if (_threadId == 0) {
        return;
      }

      PostThreadMessage(_threadId,
                        PInvoke.Constants.WM_QUIT,
                        IntPtr.Zero,
                        IntPtr.Zero);
    }
  }
}
