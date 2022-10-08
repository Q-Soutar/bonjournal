import { DB_URL_BASE, DB_ENTRIES_TLKEY, DB_TAGS_TLKEY } from "./Config";

// Set up tags on app start
export const dbInitTags = function (token, userID) {
    return new Promise((resolve, reject) => {
        // Set up fetch request
        const userKey = `/${userID}`;
        const auth = `.json?auth=${token}`;
        const dbCallURL = `${DB_URL_BASE}${DB_TAGS_TLKEY}${userKey}${auth}`;
        // Make fetch request
        fetch(dbCallURL)
            .then((res) => {
                return res.json();
            })
            .then((tags) => {
                // Once more, falsey was refusing to work for some reason, so I had to get real verbose about it
                if (
                    tags !== {} &&
                    tags !== [] &&
                    tags !== undefined &&
                    tags !== null
                ) {
                    // Format tags
                    const newTags = Object.keys(tags).map((key) => {
                        return {
                            ...tags[key],
                            uuid: key
                        };
                    });
                    // Resolve with the new object
                    resolve(newTags);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    });
};

// Retrieve info for a single tag; not sure this is utilized anywhere, but retained for the future just in case
export const dbGetTag = function (tagID, userID, token) {
    return new Promise((resolve, reject) => {
        // Ready fetch request
        const userKey = `/${userID}`;
        const tagKey = `/${tagID}`;
        const auth = `.json?auth=${token}`;
        const dbCallURL = `${DB_URL_BASE}${DB_TAGS_TLKEY}${userKey}${tagKey}${auth}`;
        // Make fetch request
        fetch(dbCallURL)
            .then((res) => {
                return res.json;
            })
            .then((tag) => {
                // Resolve with the specific tag
                // Does lack formatting though
                resolve(tag);
            })
            .catch((err) => {
                console.error(err);
            });
    });
};
// Write a new tag to the database
export const dbCreateTag = function (newTag, entryID, userID, token) {
    return new Promise((resolve, reject) => {
        // Set up fetch request
        const userKey = `/${userID}`;
        const tagKey = `/${newTag.uuid}`;
        const auth = `.json?auth=${token}`;
        const dbCallURL = `${DB_URL_BASE}${DB_TAGS_TLKEY}${userKey}${tagKey}${auth}`;
        const body = {
            text: newTag.text,
            entries: [entryID]
        };
        const params = {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            }
        };
        // Make fetch request
        fetch(dbCallURL, params)
            .then((res) => res.json())
            .then((data) => {
                // Resolve promise, affirming write
                resolve(data);
            })
            .catch((err) => console.error(err));
    });
};
// Write an update to an existing tag (whenever a new entry with an existing tag is created, essentailly)
export const dbUpdateTag = function (tag, entryID, userID, token) {
    return new Promise((resolve, reject) => {
        // Set up fetch request
        const userKey = `/${userID}`;
        const tagKey = `/${tag.uuid}`;
        const auth = `.json?auth=${token}`;
        const dbCallURL = `${DB_URL_BASE}${DB_TAGS_TLKEY}${userKey}${tagKey}${auth}`;
        const body = {
            text: tag.text,
            entries: tag.entries.concat(entryID)
        };
        const params = {
            method: "PATCH",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            }
        };
        // Make fetch request
        fetch(dbCallURL, params)
            .then((res) => res.json())
            .then((data) => {
                // Resolve and affirm update
                resolve(true);
            })
            .catch((err) => {
                reject(false);
                console.error(err);
            });
    });
};

// Deletes a tag
// Low priority, workflow for this will come much later
// Will need logic to wipe it from every entry
export const dbDeleteTag = function (tagID, userID, token) {
    return new Promise((resolve, reject) => {
        // Set up fetch request
        const userKey = `/${userID}`;
        const tagKey = `/${tagID}`;
        const auth = `.json?auth=${token}`;
        const dbCallURL = `${DB_URL_BASE}${DB_ENTRIES_TLKEY}${userKey}${tagKey}${auth}`;
        // Make fetch request
        fetch(dbCallURL, {
            method: "DELETE"
        })
            .then((res) => res.json())
            .then((data) => {
                // Resolve deletion as affirmation of success
                resolve(data);
            })
            .catch((err) => console.error(err));
    });
};
// Write new tags to firebase
export const dbTagWrite = function (
    entryTags,
    tagState,
    entryID,
    userID,
    token
) {
    /*
        1. Check whether each tag exists
        2. If the tag does exist, update it in the database
        3. If the tag does not exist, create an entirely new one
        4. Refresh tagState
    */
    return new Promise((resolve, reject) => {
        // Write each new tag, resolve on completion of all calls
        resolve(
            Promise.all(
                entryTags.map((tag) => {
                    // Check for any pre-existing tags
                    let foundTag;
                    tagState.forEach((existingTag) => {
                        if (tag.text === existingTag.text) {
                            foundTag = existingTag;
                        }
                    });
                    if (!foundTag) {
                        // If the tag doesn't already exist, write it
                        return dbCreateTag(tag, entryID, userID, token);
                    } else {
                        // If it does exist, then just update the tag in question with the new event ID
                        return dbUpdateTag(foundTag, entryID, userID, token);
                    }
                })
            )
        );
    });
};
