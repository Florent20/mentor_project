const { readData, writeData } = require('../utils/fileHelper');
const { isValidId } = require('../utils/validators');

const FILE_NAME = 'requests.json';
const MENTORS_FILE = 'mentors.json';
const MENTEES_FILE = 'mentees.json';

function stripPassword(user) {
    const { password, ...safe } = user;
    return safe;
}


// ==========================================
// SEND MENTORSHIP REQUEST
// ==========================================

function sendRequest(req, res) {

    const mentorId = parseInt(req.body.mentorId);
    const menteeId = parseInt(req.body.menteeId);
    const { message } = req.body;

    if (!Number.isInteger(mentorId) || !Number.isInteger(menteeId)) {
        return res.status(400).json({
            error: 'mentorId and menteeId are required'
        });
    }

    const mentors = readData(MENTORS_FILE);
    const mentees = readData(MENTEES_FILE);

    const mentorExists = mentors.some(
        mentor => mentor.id === mentorId
    );

    const menteeExists = mentees.some(
        mentee => mentee.id === menteeId
    );

    if (!mentorExists) {
        return res.status(404).json({
            error: 'Mentor not found'
        });
    }

    if (!menteeExists) {
        return res.status(404).json({
            error: 'Mentee not found'
        });
    }

    const requests = readData(FILE_NAME);

    const alreadyPending = requests.some(
        request =>
            request.mentorId === mentorId &&
            request.menteeId === menteeId &&
            request.status === 'pending'
    );

    if (alreadyPending) {
        return res.status(409).json({
            error: 'A pending request already exists for this mentor'
        });
    }

    const newRequest = {
        id: requests.length > 0
            ? requests[requests.length - 1].id + 1
            : 1,

        mentorId,
        menteeId,

        status: 'pending',

        message: message || '',

        createdAt: new Date().toISOString(),

        respondedAt: null
    };

    requests.push(newRequest);

    writeData(FILE_NAME, requests);

    res.status(201).json(newRequest);
}


// ==========================================
// GET ALL REQUESTS
// ==========================================

function getAllRequests(req, res) {

    const requests = readData(FILE_NAME);

    res.status(200).json(requests);
}


// ==========================================
// GET REQUESTS BY MENTOR
// ==========================================

function getRequestsByMentor(req, res) {

    if (!isValidId(req.params.mentorId)) {
        return res.status(400).json({
            error: 'Invalid mentor ID'
        });
    }

    const mentorId = parseInt(req.params.mentorId);

    const requests = readData(FILE_NAME);

    const mentorRequests = requests.filter(
        request => request.mentorId === mentorId
    );

    res.status(200).json(mentorRequests);
}


// ==========================================
// GET REQUESTS BY MENTEE
// ==========================================

function getRequestsByMentee(req, res) {

    if (!isValidId(req.params.menteeId)) {
        return res.status(400).json({
            error: 'Invalid mentee ID'
        });
    }

    const menteeId = parseInt(req.params.menteeId);

    const requests = readData(FILE_NAME);

    const menteeRequests = requests.filter(
        request => request.menteeId === menteeId
    );

    res.status(200).json(menteeRequests);
}


// ==========================================
// GET PENDING REQUESTS FOR MENTOR
// ==========================================

function getPendingRequestsForMentor(req, res) {

    if (!isValidId(req.params.mentorId)) {
        return res.status(400).json({
            error: 'Invalid mentor ID'
        });
    }

    const mentorId = parseInt(req.params.mentorId);

    const requests = readData(FILE_NAME);

    const pendingRequests = requests.filter(
        request =>
            request.mentorId === mentorId &&
            request.status === 'pending'
    );

    const mentees = readData(MENTEES_FILE);

    const enrichedRequests = pendingRequests.map(request => {

        const mentee = mentees.find(
            mentee => mentee.id === request.menteeId
        );

        return {
            ...request,

            mentee: mentee
                ? stripPassword(mentee)
                : null
        };
    });

    res.status(200).json(enrichedRequests);
}


// ==========================================
// GET ACTIVE MENTEES FOR MENTOR
// ==========================================

function getMenteesForMentor(req, res) {

    if (!isValidId(req.params.mentorId)) {
        return res.status(400).json({
            error: 'Invalid mentor ID'
        });
    }

    const mentorId = parseInt(req.params.mentorId);

    const requests = readData(FILE_NAME);

    const acceptedRequests = requests.filter(
        request =>
            request.mentorId === mentorId &&
            request.status === 'accepted'
    );

    const mentees = readData(MENTEES_FILE);

    const activeMentees = acceptedRequests
        .map(request => {

            const mentee = mentees.find(
                mentee => mentee.id === request.menteeId
            );

            if (!mentee) {
                return null;
            }

            return {
                ...stripPassword(mentee),

                requestId: request.id
            };
        })
        .filter(Boolean);

    res.status(200).json(activeMentees);
}


// ==========================================
// ACCEPT / REJECT REQUEST
// ==========================================

function respondToRequest(req, res) {

    if (!isValidId(req.params.id)) {
        return res.status(400).json({
            error: 'Invalid request ID'
        });
    }

    const { status } = req.body;

    if (
        status !== 'accepted' &&
        status !== 'rejected'
    ) {
        return res.status(400).json({
            error: 'status must be "accepted" or "rejected"'
        });
    }

    const requests = readData(FILE_NAME);

    const requestId = parseInt(req.params.id);

    const index = requests.findIndex(
        request => request.id === requestId
    );

    if (index === -1) {
        return res.status(404).json({
            error: 'Request not found'
        });
    }

    if (requests[index].status !== 'pending') {
        return res.status(409).json({
            error:
                `Request has already been ${requests[index].status}`
        });
    }

    requests[index].status = status;

    requests[index].respondedAt =
        new Date().toISOString();

    writeData(FILE_NAME, requests);

    res.status(200).json(requests[index]);
}


// ==========================================
// GET ACTIVE RELATIONSHIPS
// ==========================================

function getActiveRelationships(req, res) {

    const requests = readData(FILE_NAME);

    const accepted = requests.filter(
        request => request.status === 'accepted'
    );

    res.status(200).json(accepted);
}


module.exports = {

    sendRequest,

    getAllRequests,

    getRequestsByMentor,

    getRequestsByMentee,

    getPendingRequestsForMentor,

    getMenteesForMentor,

    respondToRequest,

    getActiveRelationships

};