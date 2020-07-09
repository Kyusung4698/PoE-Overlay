using System;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace overwolf.plugins
{
  public sealed class clipboard
  {
    public void placeOnClipboard(string content, Action<object> callback)
    {
      startSTATask(() =>
      {
        try
        {
          if (!string.IsNullOrWhiteSpace(content))
          {
            var obj = new DataObject();
            obj.SetText(content);
            Clipboard.SetDataObject(obj, true);
          }
          else
          {
            Clipboard.Clear();
          }
          callback(new
          {
            success = true
          });
        }
        catch (Exception ex)
        {
          callback(new
          {
            success = false,
            error = ex.ToString()
          });
        }
      });
    }

    public void getFromClipboard(Action<object> callback)
    {
      startSTATask(() =>
      {
        try
        {
          var content = Clipboard.GetText();
          callback(new
          {
            success = true,
            content
          });
        }
        catch (Exception ex)
        {
          callback(new
          {
            success = false,
            error = ex.ToString()
          });
        }
      });
    }

    private static void startSTATask(Action func)
    {
      var tcs = new TaskCompletionSource<object>();
      var thread = new Thread(() =>
      {
        try
        {
          func();
          tcs.SetResult(null);
        }
        catch (Exception e)
        {
          tcs.SetException(e);
        }
      });
      thread.SetApartmentState(ApartmentState.STA);
      thread.Start();
    }
  }
}
