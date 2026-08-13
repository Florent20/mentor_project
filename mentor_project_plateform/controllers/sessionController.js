const { readData, writeData } = require('../utils/fileHelper');
const { isValidId } = require('../utils/validators');

const FILE_NAME = 'sessions.json';
const REQUESTS_FILE = 'requests.json';


// ==========================================
// CREATE SESSION
// ==========================================

function createSession(req, res) {

    const requestId = parseInt(req.body.requestId);

    const {
        scheduledDate,
        topic
    } = req.body;


    if (
        !Number.isInteger(requestId) ||
        !scheduledDate ||
        !topic
    ) {
        return res.status(400).json({
            error:
                'requestId, scheduledDate, and topic are required'
        });
    }


    const date = new Date(scheduledDate);


    if (Number.isNaN(date.getTime())) {
        return res.status(400).json({
            error:
                'scheduledDate must be a valid date'
        });
    }


    if (date <= new Date()) {
        return res.status(400).json({
            error:
                'Session date must be in the future'
        });
    }


    const requests =
        readData(REQUESTS_FILE);


    const request =
        requests.find(
            request => request.id === requestId
        );


    if (!request) {
        return res.status(404).json({
            error: 'Request not found'
        });
    }


    if (request.status !== 'accepted') {
        return res.status(409).json({
            error:
                'Sessions can only be created for accepted requests'
        });
    }


    const sessions =
        readData(FILE_NAME);


    const duplicate =
        sessions.some(
            session =>
                session.requestId === requestId &&
                session.status === 'upcoming'
        );


    if (duplicate) {
        return res.status(409).json({
            error:
                'This mentorship already has an upcoming session'
        });
    }


    const newSession = {

        id:
            sessions.length > 0
                ? sessions[sessions.length - 1].id + 1
                : 1,

        requestId,

        mentorId: request.mentorId,

        menteeId: request.menteeId,

        scheduledDate:
            date.toISOString(),

        topic:
            topic.trim(),

        status:
            'upcoming',

        feedback:
            null,

        createdAt:
            new Date().toISOString()
    };


    sessions.push(newSession);


    writeData(
        FILE_NAME,
        sessions
    );


    res.status(201).json(newSession);
}


// ==========================================
// GET ALL SESSIONS
// ==========================================

function getAllSessions(req, res) {

    const sessions =
        readData(FILE_NAME);

    res.status(200).json(sessions);
}


// ==========================================
// GET UPCOMING SESSIONS
// ==========================================

function getUpcomingSessions(req, res) {

    const sessions =
        readData(FILE_NAME);

    const {
        mentorId,
        menteeId
    } = req.query;


    let upcoming =
        sessions.filter(
            session =>
                session.status === 'upcoming'
        );


    if (mentorId) {

        upcoming =
            upcoming.filter(
                session =>
                    session.mentorId ===
                    parseInt(mentorId)
            );
    }


    if (menteeId) {

        upcoming =
            upcoming.filter(
                session =>
                    session.menteeId ===
                    parseInt(menteeId)
            );
    }


    res.status(200).json(upcoming);
}


// ==========================================
// GET SESSION BY ID
// ==========================================

function getSessionById(req, res) {

    if (!isValidId(req.params.id)) {

        return res.status(400).json({
            error: 'Invalid session ID'
        });
    }


    const sessions =
        readData(FILE_NAME);


    const session =
        sessions.find(
            session =>
                session.id ===
                parseInt(req.params.id)
        );


    if (!session) {

        return res.status(404).json({
            error: 'Session not found'
        });
    }


    res.status(200).json(session);
}


// ==========================================
// ADD FEEDBACK
// ==========================================

function addFeedback(req, res) {

    if (!isValidId(req.params.id)) {

        return res.status(400).json({
            error: 'Invalid session ID'
        });
    }


    const {
        fromMentor,
        fromMentee
    } = req.body;


    if (!fromMentor && !fromMentee) {

        return res.status(400).json({
            error:
                'At least one feedback message is required'
        });
    }


    const sessions =
        readData(FILE_NAME);


    const sessionId =
        parseInt(req.params.id);


    const index =
        sessions.findIndex(
            session =>
                session.id === sessionId
        );


    if (index === -1) {

        return res.status(404).json({
            error: 'Session not found'
        });
    }


    const oldFeedback =
        sessions[index].feedback || {};


    sessions[index].feedback = {

        fromMentor:
            fromMentor?.trim() ||
            oldFeedback.fromMentor ||
            null,

        fromMentee:
            fromMentee?.trim() ||
            oldFeedback.fromMentee ||
            null
    };


    // Mark completed once both people
    // have submitted feedback.

    if (
        sessions[index].feedback.fromMentor &&
        sessions[index].feedback.fromMentee
    ) {

        sessions[index].status =
            'completed';
    }


    writeData(
        FILE_NAME,
        sessions
    );


    res.status(200).json(
        sessions[index]
    );
}


// ==========================================
// CANCEL SESSION
// ==========================================

function cancelSession(req, res) {

    if (!isValidId(req.params.id)) {

        return res.status(400).json({
            error: 'Invalid session ID'
        });
    }


    const sessions =
        readData(FILE_NAME);


    const index =
        sessions.findIndex(
            session =>
                session.id ===
                parseInt(req.params.id)
        );


    if (index === -1) {

        return res.status(404).json({
            error: 'Session not found'
        });
    }


    sessions[index].status =
        'cancelled';


    writeData(
        FILE_NAME,
        sessions
    );


    res.status(200).json(
        sessions[index]
    );
}


module.exports = {

    createSession,

    getAllSessions,

    getUpcomingSessions,

    getSessionById,

    addFeedback,

    cancelSession

};