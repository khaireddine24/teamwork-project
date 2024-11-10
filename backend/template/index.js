import { welcomeEmail } from './emails/welcomeEmail.js';
import { verificationCode } from './emails/verificationCode.js';
import { articleAddedNotification } from './notifications/articleAddedNotification.js';
import { articleDeletedNotification } from './notifications/articleDeletedNotification.js';
import { adminNotification } from './notifications/adminNotification.js';
import { ProfileUpdated } from './emails/ProfileUpdated.js';
import { articleupdated } from './notifications/articleupdated.js';

export const templates = {
    emails: {
        welcomeEmail,
        verificationCode,
        ProfileUpdated
    },
    notifications: {
        articleDeletedNotification,
        adminNotification,
        articleAddedNotification,
        articleupdated
    },
};
