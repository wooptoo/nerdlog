var sql = require('mysql');
var _   = require('lodash');

/* SQL connection */
var conn = sql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'nerdlog'
});

conn.connect();

/**
 * Get all users.
 */
function getUser(id, callback) {
    if (!id) {
        throw new Error('No ID provided');
    }
    conn.query('select * from users where user_id = ?', [id], callback);
}

/**
 * Get all available boards.
 */
function getAllBoards(callback) {
    return conn.query('select * from boards', callback);
}

/**
 * Get all posts from a board.
 */
function getAllPostsFromBoard(boardId, callback) {
    if (!boardId) {
        throw new Error('No board ID provided');
    }
    return conn.query(
        '(select * from posts \
        left join users on posts.user_id = users.user_id \
        where board_id = ? \
        order by posts.post_id desc \
        limit 25) order by post_id asc',
        [boardId],
        callback
    );
}

/**
 * Get one post.
 */
function getPost(postId, callback) {
    if(_.isEmpty(arguments)) {
        throw new Error('No arguments provided');
    }
    return conn.query(
        'select * from posts \
        left join users on posts.user_id = users.user_id \
        where post_id = ?',
        [postId],
        callback
    );
}

/**
 * Add post to board.
 */
function addPostToBoard(boardId, userId, contents, callback) {
    if(_.isEmpty(arguments)) {
        throw new Error('No arguments provided');
    }
    return conn.query(
        'insert into posts set ?', 
        {
            board_id: boardId,
            user_id: userId, 
            post_created: new Date(), 
            post_contents: contents
        },
        callback
    );
}

/**
 * Export public functions.
 */
module.exports = {
    getAllBoards: getAllBoards,
    getAllPostsFromBoard: getAllPostsFromBoard,
    addPostToBoard: addPostToBoard,
    getUser: getUser,
    getPost: getPost
};
