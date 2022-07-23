SELECT
    music.id,
    upload_time,
    uploader_id as user_id,
    user_account.user_name,
    title,
    artist.name,
    record_label.name,
    publisher.name,
    album,
    link,
    num_played,
    avg_rating,
    COALESCE(favourite_music.music_id, 0) as is_favourite
FROM
    music
INNER JOIN(
    SELECT
        tag_pairing.music_id
    FROM
        tag_pairing
    INNER JOIN tag ON tag.id = tag_pairing.tag_id
    WHERE
        tag.name IN('edm', 'dance', 'dark')
    GROUP BY
        tag_pairing.music_id
) AS tagged_music
ON
    tagged_music.music_id = music.id
INNER JOIN user_account ON user_account.id = music.uploader_id
INNER JOIN artist ON artist.id = music.artist_id
LEFT JOIN record_label ON record_label.id = music.record_label_id
LEFT JOIN publisher ON publisher.id = music.publisher_id
LEFT JOIN ( SELECT music_id FROM user_favourite WHERE user_favourite.user_id = user_id ) AS favourite_music ON favourite_music.music_id = music.id
HAVING user_account.user_name IN ('Midnight')
ORDER BY music.upload_time DESC
LIMIT 8