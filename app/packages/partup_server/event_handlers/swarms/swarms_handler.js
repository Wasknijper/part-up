/**
 * Update the swarm stats
 */
Event.on('partups.swarms.networks.updated', function(userId, swarm) {
    if (!userId) return;

    // A network has been added or removed, so we need to update the swarm stats
    Partup.server.services.swarms.updateStats(swarm);
});
