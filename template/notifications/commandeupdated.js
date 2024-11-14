export const commandeupdated = (commande) => {
    return {
        subject: 'commande Updated',
        text: `The commande (ID: ${commande.id}) has been Updated .`,
    };
};
