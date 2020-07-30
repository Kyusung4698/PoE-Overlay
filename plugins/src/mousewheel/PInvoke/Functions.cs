using System;
using System.Runtime.InteropServices;
using static overwolf.plugins.mousewheel.PInvoke.Constants;

namespace overwolf.plugins.mousewheel.PInvoke {
  internal class Functions {

    [DllImport("user32.dll", SetLastError = true)]
    public static extern IntPtr FindWindow(string lpClassName,
                                           string lpWindowName);

    [DllImport("user32.dll")]
    public static extern IntPtr GetForegroundWindow();

    [DllImport("user32.dll")]
    [return: MarshalAs(UnmanagedType.Bool)]
    public static extern bool SetCursorPos(int x, int y);

    [DllImport("user32.dll")]
    public static extern bool  SendMessage(IntPtr hWnd,
                                           uint Msg,
                                           int wParam,
                                           int lParam);

    [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
    public static extern bool PostMessage(IntPtr hWnd,
                                          uint Msg,
                                          IntPtr wParam,
                                          IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern int GetMessage(out MSG lpMsg,
                                        IntPtr hWnd,
                                        uint wMsgFilterMin,
                                        uint wMsgFilterMax);

    [DllImport("user32.dll")]
    public static extern bool TranslateMessage([In] ref MSG lpMsg);

    [DllImport("user32.dll")]
    public static extern IntPtr DispatchMessage([In] ref MSG lpmsg);

    [DllImport("kernel32.dll")]
    public static extern uint GetCurrentThreadId();

    [DllImport("user32.dll")]
    public static extern uint MapVirtualKey(uint uCode, uint uMapType);

    [return: MarshalAs(UnmanagedType.Bool)]
    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool PostThreadMessage(uint threadId,
                                                uint msg,
                                                IntPtr wParam,
                                                IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern bool ClientToScreen(IntPtr hWnd, ref POINT lpPoint);

    [DllImport("user32.dll", SetLastError = true)]
    public static extern uint GetWindowThreadProcessId(IntPtr hWnd,
                                                       out uint lpdwProcessId);

    public delegate int HookProc(int code, IntPtr wParam, IntPtr lParam);

    [DllImport("user32.dll", SetLastError = true)]
    public static extern IntPtr SetWindowsHookEx(HookType hookType,
                                                 HookProc lpfn,
                                                 IntPtr hMod,
                                                 uint dwThreadId);

    [DllImport("user32.dll")]
    public static extern int CallNextHookEx(IntPtr hhk,
                                            int nCode,
                                            IntPtr wParam,
                                            IntPtr lParam);

    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool UnhookWindowsHookEx(IntPtr hhk);

    [DllImport("USER32.dll")]
    public static extern short GetKeyState(VirtualKeyStates nVirtKey);

    [StructLayout(LayoutKind.Sequential)]

    public struct MSG {
      IntPtr hwnd;
      uint message;
      UIntPtr wParam;
      IntPtr lParam;
      int time;
      POINT pt;
    }

    [StructLayout(LayoutKind.Sequential)]
    public struct POINT {
      public int X;
      public int Y;

      public POINT(int x, int y) {
        this.X = x;
        this.Y = y;
      }
    }

    [StructLayout(LayoutKind.Sequential)]
    public struct MSLLHOOKSTRUCT {
      public POINT pt;
      public int mouseData; // be careful, this must be ints, not uints (was wrong before I changed it...). regards, cmew.
      public int flags;
      public int time;
      public UIntPtr dwExtraInfo;
    }
  }
}
