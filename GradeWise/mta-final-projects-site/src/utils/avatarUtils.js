// Avatar utility functions
export const getAvatarUrl = (avatarId) => {
  const avatars = {
    'default': '/Assets/icons/default-avatar.png',
    'mario': '/Assets/icons/mario.jpg',
    'ohad-avidar': '/Assets/icons/ohad-avidar.jpg',
    'trump': '/Assets/icons/trump.jpg',
    'harry-potter': '/Assets/icons/harry-potter.jpg',
    'the-rock': '/Assets/icons/the-rock.jpg',
    'jimmy-hendrix': '/Assets/icons/jimmy-hendrix.jpg',
    'cristiano-ronaldo': '/Assets/icons/cristiano-ronaldo.jpg',
    'spongebob': '/Assets/icons/spongebob.png',
    'pikachu': '/Assets/icons/pikachu.png',
    'spiderman': '/Assets/icons/spiderman.webp',
    'batman': '/Assets/icons/batman.png',
    'voldemort': '/Assets/icons/voldemort.jpg',
    'aladdin': '/Assets/icons/aladdin.jpeg',
    'mufasa': '/Assets/icons/lion_king_Mufasa.webp',
    'smurf': '/Assets/icons/smurf.jpg'
  };
  
  return avatars[avatarId] || avatars['default'];
};
