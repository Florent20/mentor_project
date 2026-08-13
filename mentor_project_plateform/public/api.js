// ==========================================
// MENTORCONNECT API
// ==========================================

const API_BASE = 'http://localhost:3000/api';


// ==========================================
// GET
// ==========================================

async function apiGet(path) {

    try {

        const response =
            await fetch(`${API_BASE}${path}`);


        const data =
            await response.json();


        return {
            ok: response.ok,
            status: response.status,
            data
        };

    } catch (error) {

        return {
            ok: false,
            status: 0,
            data: {
                error:
                    'Could not reach the server. Is it running?'
            }
        };
    }
}


// ==========================================
// POST
// ==========================================

async function apiPost(path, body) {

    try {

        const response =
            await fetch(`${API_BASE}${path}`, {

                method: 'POST',

                headers: {
                    'Content-Type':
                        'application/json'
                },

                body:
                    JSON.stringify(body)
            });


        const data =
            await response.json();


        return {
            ok: response.ok,
            status: response.status,
            data
        };

    } catch (error) {

        return {
            ok: false,
            status: 0,
            data: {
                error:
                    'Could not reach the server. Is it running?'
            }
        };
    }
}


// ==========================================
// PUT
// ==========================================

async function apiPut(path, body) {

    try {

        const response =
            await fetch(`${API_BASE}${path}`, {

                method: 'PUT',

                headers: {
                    'Content-Type':
                        'application/json'
                },

                body:
                    JSON.stringify(body)
            });


        const data =
            await response.json();


        return {
            ok: response.ok,
            status: response.status,
            data
        };

    } catch (error) {

        return {
            ok: false,
            status: 0,
            data: {
                error:
                    'Could not reach the server. Is it running?'
            }
        };
    }
}


// ==========================================
// CURRENT USER
// ==========================================

function saveCurrentUser(user) {

    localStorage.setItem(
        'currentUser',
        JSON.stringify(user)
    );
}


function getCurrentUser() {

    const raw =
        localStorage.getItem(
            'currentUser'
        );

    return raw
        ? JSON.parse(raw)
        : null;
}


function clearCurrentUser() {

    localStorage.removeItem(
        'currentUser'
    );
}


function requireLogin() {

    const user =
        getCurrentUser();


    if (!user) {

        window.location.href =
            'login.html';

        return null;
    }


    return user;
}