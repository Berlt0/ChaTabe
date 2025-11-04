
const datas = [{
    user_id: 1,
    username: 'Gilbert',
    moodColor: '#dd7c30',
    moodStatus:'Happy',
    recentMessage: 'I love you',
    recentMessageTime: '7:34',
    isActive: true,
    profilePath: '../Frontend/ChaTabe/public/bert.png'

},{
    user_id: 2,
    username: 'Berlto',
    moodColor: '#1a4097',
    moodStatus:'Sad',
    recentMessage: 'I love you',
    recentMessageTime: '7:10',
    isActive: true,
    profilePath: '../Frontend/ChaTabe/public/bert.png'
},{
    user_id: 3,
    username: 'John',
    moodColor: '#ff3131',
    moodStatus:'Angry',
    recentMessage: 'I love you',
    recentMessageTime: '7:09',
    isActive: false,
    profilePath: '../Frontend/ChaTabe/public/bert.png'
},{
    user_id: 4,
    username: 'Macho Gwapito',
    moodColor: '#7228c2',
    moodStatus:'Afraid',
    recentMessage: 'I love you',
    recentMessageTime: '7:00',
    isActive: true,
    profilePath: '../Frontend/ChaTabe/public/bert.png'
},{
    user_id: 5,
    username: 'Chixboi',
    moodColor: '#049650',
    moodStatus:'Annoyed',
    recentMessage: 'I love you',
    recentMessageTime: '7:00',
    isActive: false,
    profilePath: '../Frontend/ChaTabe/public/bert.png'
}

    

]


const getUserData = (req, res) => {
  res.json(datas);
};

module.exports = { getUserData };

