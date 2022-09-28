const DB_URL_BASE = "https://bonjournal-360318-default-rtdb.firebaseio.com";
// TL = "top-level"
const DB_ENTRIES_TLKEY = "/entries";
const DB_TAGS_TLKEY = "/tags";

export const dbInitTags = function (token, userID) {
    return new Promise((resolve, reject) => {
        const userKey = `/${userID}`;
        const auth = `.json?auth=${token}`;
        const dbCallURL = `${DB_URL_BASE}${DB_TAGS_TLKEY}${userKey}${auth}`;
        fetch(dbCallURL)
            .then((res) => {
                return res.json();
            })
            .then((tags) => {
                if (
                    tags !== {} &&
                    tags !== [] &&
                    tags !== undefined &&
                    tags !== null
                ) {
                    const newTags = Object.keys(tags).map((key) => {
                        return {
                            ...tags[key],
                            uuid: key
                        };
                    });
                    resolve(newTags);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    });
};

export const dbGetTag = function (tagID, userID, token) {
    return new Promise((resolve, reject) => {
        const userKey = `/${userID}`;
        const tagKey = `/${tagID}`;
        const auth = `.json?auth=${token}`;
        const dbCallURL = `${DB_URL_BASE}${DB_TAGS_TLKEY}${userKey}${tagKey}${auth}`;
        fetch(dbCallURL)
            .then((res) => {
                return res.json;
            })
            .then((tag) => {
                resolve(tag);
            })
            .catch((err) => {
                console.error(err);
            });
    });
};

export const dbCreateTag = function (newTag, entryID, userID, token) {
    return new Promise((resolve, reject) => {
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
        fetch(dbCallURL, params)
            .then((res) => res.json())
            .then((data) => {
                resolve(data);
            })
            .catch((err) => console.error(err));
    });
};

export const dbUpdateTag = function (tag, entryID, userID, token) {
    return new Promise((resolve, reject) => {
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
        fetch(dbCallURL, params)
            .then((res) => res.json())
            .then((data) => {
                resolve(true);
            })
            .catch((err) => {
                reject(false);
                console.error(err);
            });
    });
};

// Low priority, workflow for this will come much later
// Will need logic to wipe it from every entry
export const dbDeleteTag = function (tagID, userID, token) {
    return new Promise((resolve, reject) => {
        const userKey = `/${userID}`;
        const tagKey = `/${tagID}`;
        const auth = `.json?auth=${token}`;
        const dbCallURL = `${DB_URL_BASE}${DB_ENTRIES_TLKEY}${userKey}${tagKey}${auth}`;
        fetch(dbCallURL, {
            method: "DELETE"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
            })
            .catch((err) => console.error(err));
    });
};

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
        resolve(
            Promise.all(
                entryTags.map((tag) => {
                    let foundTag;
                    tagState.forEach((existingTag) => {
                        if (tag.text === existingTag.text) {
                            foundTag = existingTag;
                        }
                    });
                    if (!foundTag) {
                        return dbCreateTag(tag, entryID, userID, token);
                    } else {
                        return dbUpdateTag(foundTag, entryID, userID, token);
                    }
                })
            )
        );
    });
};
