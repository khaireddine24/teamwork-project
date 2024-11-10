export const articleDeletedNotification = (article) => {
    return {
        subject: 'Article Deleted',
        text: `The article "${article.name}" (ID: ${article.id}) has been deleted from the system.`,
    };
};
