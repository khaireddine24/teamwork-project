export const articleupdated = (article) => {
    return {
        subject: 'Article Updated',
        text: `The article "${article.name}" (ID: ${article.id}) has been Updated .`,
    };
};
