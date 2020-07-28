namespace overwolf.plugins.mousewheel.Models
{
  /// <summary>
  /// 
  /// </summary>
  public class InputOptions
  {
    public InputOptionsWinInfo windowInfo;
    public InputOptionsInfo inputInfo;
  }

  /// <summary>
  /// 
  /// </summary>
  public class InputOptionsWinInfo
  {
    public string winClassname;
    public string winTitle;
  }

  /// <summary>
  /// 
  /// </summary>
  public class InputOptionsInfo
  {
    public bool wheelUp;
    public bool wheelDown;
    public bool controlPressed;
    public bool shiftPressed;

    /// <summary>
    /// 
    /// </summary>
    /// <returns></returns>
    public override int GetHashCode()
    {
      return base.GetHashCode();
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="obj"></param>
    /// <returns></returns>
    public override bool Equals(object obj)
    {
      if (!(obj is InputOptionsInfo info))
      {
        return false;
      }

      return info.wheelUp == wheelUp &&
             info.wheelDown == wheelDown &&
             info.controlPressed == controlPressed &&
             info.shiftPressed == shiftPressed;
    }
  }
}
