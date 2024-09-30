public class User {
    /**
     * 用户ID
     */
    private Integer id;
    /**
     * 用户账号
     */
    private String userCode;
    /**
     * 用户名
     */
    private String userName;
    /**
     * 用户密码
     */
    private String password;
    /**
     * 用户类型
     */
    private String typeCode;
    /**
     * 用户所属组（科室、公司等）
     */
    private String groupCode;
    /**
     * 用户地址
     */
    private String address;
    /**
     * 手机号
     */
    private String mobile;
    /**
     * 电话号码
     */
    private String phoneNum;
    /**
     * 邮箱
     */
    private String eMail;
    /**
     * 用户角色
     */
    private Integer roleId;
    /**
     * 锁定状态1:未锁定2：锁定
     */
    private Integer userLock;
    /**
     * 锁定时间
     */
    private Date gmtUserLock;
    /**
     * 用户更新日期
     */
    private Date gmtModified;
    /**
     * 创建时间
     */
    private Date gmtCreated;
    /**
     * 删除状态
     */
    private Integer isDel;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUserCode() {
        return userCode;
    }

    public void setUserCode(String userCode) {
        this.userCode = userCode;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getTypeCode() {
        return typeCode;
    }

    public void setTypeCode(String typeCode) {
        this.typeCode = typeCode;
    }

    public String getGroupCode() {
        return groupCode;
    }

    public void setGroupCode(String groupCode) {
        this.groupCode = groupCode;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getPhoneNum() {
        return phoneNum;
    }

    public void setPhoneNum(String phoneNum) {
        this.phoneNum = phoneNum;
    }

    public String getEMail() {
        return eMail;
    }

    public void setEMail(String eMail) {
        this.eMail = eMail;
    }

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    public Integer getUserLock() {
        return userLock;
    }

    public void setUserLock(Integer userLock) {
        this.userLock = userLock;
    }

    public Date getGmtUserLock() {
        return gmtUserLock;
    }

    public void setGmtUserLock(Date gmtUserLock) {
        this.gmtUserLock = gmtUserLock;
    }

    public Date getGmtModified() {
        return gmtModified;
    }

    public void setGmtModified(Date gmtModified) {
        this.gmtModified = gmtModified;
    }

    public Date getGmtCreated() {
        return gmtCreated;
    }

    public void setGmtCreated(Date gmtCreated) {
        this.gmtCreated = gmtCreated;
    }

    public Integer getIsDel() {
        return isDel;
    }

    public void setIsDel(Integer isDel) {
        this.isDel = isDel;
    }
}
