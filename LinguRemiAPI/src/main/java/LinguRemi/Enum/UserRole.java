package LinguRemi.Enum;

public enum UserRole {
	ADMIN("admin"),
	USER("user");
	
	private String role;
	
	UserRole(String Role) {
		this.role = Role;
	}
	
	public String getRole() {
		return role;
	}
}
