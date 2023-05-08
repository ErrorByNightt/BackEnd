const friendRequest = new FriendRequest({
    senderId: senderId,
    recicpientId: recicpientId,
    status: "Pending"
})
friendRequest.save()
    .then(frreq => {
        res.status(200).json({frreq: frreq})
    })
    .catch(err => {
        res.json({
            error: err
        })
    })