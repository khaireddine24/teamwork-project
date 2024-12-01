export const commandeDeletedNotification = (commande) => {
    return {
        subject: 'Commande Deleted',
        text: `the commande  (ID: ${commande.id}) has been deleted from the system.`,
    };
};
