export const articleAddedNotification = (article) => {
    return {
        subject: 'An Article Added',
        text: `An article has been added.\n\nArticle Name: ${article.name}\nArticle ID: ${article.id}`,
      
    };
};
