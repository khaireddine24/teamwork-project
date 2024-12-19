import {WelcomeEmail} from './emails/WelcomeEmail.js'
import { verificationCode } from './emails/verificationCode.js';
import { articleAddedNotification } from './notifications/articleAddedNotification.js';
import { articleDeletedNotification } from './notifications/articleDeletedNotification.js';
import { adminNotification } from './notifications/adminNotification.js';
import { ProfileUpdated } from './emails/ProfileUpdated.js';
import { articleupdated } from './notifications/articleupdated.js';
import { commandeAddedNotification } from './notifications/commandeAddedNotification.js';
import { commandeDeletedNotification } from './notifications/commandeDeletedNotification.js';
import { commandeupdated } from './notifications/commandeupdated.js';

export const templates = {
    emails: {
        WelcomeEmail,
        verificationCode,
        ProfileUpdated
    },
    notifications: {
        articleDeletedNotification,
        adminNotification,
        articleAddedNotification,
        articleupdated,
        commandeAddedNotification,
        commandeDeletedNotification,
        commandeupdated
    },
};
