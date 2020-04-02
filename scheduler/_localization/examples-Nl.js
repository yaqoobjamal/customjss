import LocaleManager from '../../lib/Core/localization/LocaleManager.js';
import '../../lib/Scheduler/localization/Nl.js';

const examplesLocale = {
    extends : 'Nl',

    Column : {
        'Name'             : 'Naam',
        'City'             : 'Stad',
        'Role'             : 'Rol',
        'Staff'            : 'Personeel',
        'Machines'         : 'Machines',
        'Type'             : 'Type',
        'Task color'       : 'Taakkleur',
        'Employment type'  : 'Type werkgeverschap',
        'Capacity'         : 'Capaciteit',
        'Production line'  : 'Productielijn',
        'Company'          : 'Bedrijf',
        'Start'            : 'Begin',
        'End'              : 'Einde',
        'Nbr tasks'        : 'Numerieke taken',
        'Unassigned tasks' : 'Niet-toegewezen taken',
        'Duration'         : 'Looptijd'
    },

    Shared : {
        'Locale changed' : 'Taal is veranderd'
    },

    EventEdit : {
        'Location' : 'Plaats'
    }
};

export default examplesLocale;

LocaleManager.extendLocale('Nl', examplesLocale);
