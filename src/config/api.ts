// API endpoints configuration
export const API_ENDPOINTS = {
  CONNTEST: '/proxy/api/connTest',
  CHAT_STREAM: '/proxy/api/chat/chatStreamWithSession',
  CHAT_STREAM_PRODUCT: '/proxy/api/chat/chatStreamProductIntroduction',
  CHAT_STREAM_SOLUTIONS: '/proxy/api/chat/chatStreamSolutions',
  CHAT_STREAM_CONFERENCE: '/proxy/api/chat/chatStreamConference',
  CHAT_STREAM_CONFERENCE_LOCAL_FILE: '/proxy/api/chat/chatStreamConferenceLocalFile',
  CHAT_STREAM_LOCAL_IMAGE: '/proxy/api/chat/chatStreamLocalImag',
} as const;

// export const API_ENDPOINTS = {
//   CHAT_STREAM: '/proxy/app/aichat/chatStreamWithSession',
//   CHAT_STREAM_PRODUCT: '/proxy/app/aichat/chatStreamProductIntroduction',
//   CHAT_STREAM_SOLUTIONS: '/proxy/app/aichat/chatStreamSolutions',
//   CHAT_STREAM_CONFERENCE: '/proxy/app/aichat/chatStreamConference',
//   CHAT_STREAM_CONFERENCE_LOCAL_FILE: '/proxy/app/chat/chatStreamConferenceLocalFile',
//   CHAT_STREAM_LOCAL_IMAGE: '/proxy/app/aichat/chatStreamLocalImag',
// } as const;

export default API_ENDPOINTS; 