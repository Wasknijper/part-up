/**
 @name Partup.constants
 @memberof Partup.factories
 */
Partup.constants.EMAIL_FROM = process.env.PARTUP_EMAIL_FROM || 'Part-up <team@part-up.com>';
Partup.constants.CRON_DIGEST = process.env.PARTUP_CRON_DIGEST || 'at 09:00am every weekday';
Partup.constants.CRON_ENDDATE_REMINDER = process.env.PARTUP_CRON_ENDDATE_REMINDER || 'every 1 hour on the 10th minute';
Partup.constants.CRON_PROGRESS = process.env.PARTUP_CRON_PROGRESS || 'every 1 hour on the 15th minute';
Partup.constants.CRON_PARTICIPATION = process.env.PARTUP_CRON_PARTICIPATION || 'every 1 hour on the 30th minute';
Partup.constants.CRON_RESET_CLICKS = process.env.PARTUP_CRON_RESET_CLICKS || 'every 1 hour on the 45th minute';
Partup.constants.CRON_SHARED_COUNTS = process.env.PARTUP_CRON_SHARED_COUNTS || 'every 13 minutes';
Partup.constants.CRON_POPULARITY = process.env.PARTUP_CRON_POPULARITY || 'every 1 hour on the 20th minute';
Partup.constants.CRON_UPDATE_SWARM_NETWORK_STATS = process.env.PARTUP_CRON_UPDATE_SWARM_NETWORK_STATS || 'every 2 hours on the 17th minute';
Partup.constants.CRON_SWARM_SHARED_COUNTS = process.env.PARTUP_CRON_SWARM_SHARED_COUNTS || 'every 10 hours on the 38th minute';
Partup.constants.CRON_CALCULATE_ACTIVE_NETWORK_UPPERS_PARTUPS = process.env.PARTUP_CRON_CALCULATE_ACTIVE_NETWORK_UPPERS_PARTUPS || 'every 4 hours on the 19th minute';
Partup.constants.CRON_GET_COMMON_NETWORK_TAGS = process.env.PARTUP_CRON_GET_COMMON_NETWORK_TAGS || 'every 6 hours on the 25th minute';
