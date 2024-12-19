export const WelcomeEmail = (user,accessLink) => {
    return {
        subject: 'Access is Guranted',
        text: `
             Hello ${user.name}, your access has been granted.\nthis link to access ${accessLink}`
    };
};
