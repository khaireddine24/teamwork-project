export const commandeAddedNotification = (commande) => {
    return {
        subject: 'A Commande Added',
        text: `A commande has been added.\n\nCommande ID: ${commande.id}`,
    };
};
