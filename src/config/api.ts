// API endpoints configuration
export const API_ENDPOINTS = {
  CHAT_STREAM: '/proxy/api/chat/chatStreamWithSession',
  CHAT_STREAM_PRODUCT: '/proxy/api/chat/chatStreamProductIntroduction',
  CHAT_STREAM_CONFERENCE: '/proxy/api/chat/chatStreamConference',
  CHAT_STREAM_CONFERENCE_LOCAL_FILE: '/proxy/api/chat/chatStreamConferenceLocalFile',
  CHAT_STREAM_LOCAL_IMAGE: '/proxy/api/chat/chatStreamLocalImag',
} as const;

export default API_ENDPOINTS; 