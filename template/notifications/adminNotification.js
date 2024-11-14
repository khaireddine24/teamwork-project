export const adminNotification = (user) => {
    return {
        subject: 'A user added',
        text: `
            'New User registred',
            A User with "${user.name}" has been added 
        `
    };
};
