export const validateemail = (email: string): boolean => {
    // email should be 3-20 characters long and contain only letters, numbers, and underscores
    const emailRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
    // Password should be at least 8 characters long and contain at least one letter and one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
};