export const verificationCode = (code) => {
    return {
        subject: 'Your Verification Code',
        text: `
            <p>Your verification code is: <strong>${code}</strong></p>
            <p>Please enter this code to verify your account.</p>
        `
    };
};
