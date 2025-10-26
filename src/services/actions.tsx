export const Actions = {
  // SYSTEM
  SYSTEM_INITIAL_SYNC: "system.initial_sync",

  // AUTH
  AUTH_LOGIN: "auth.login",
  AUTH_REGISTER: "auth.register",
  AUTH_LOGOUT: "auth.logout",

  // CHAT
  CHAT_SEND_TEXT: "chat.send_text",
  CHAT_SEND_GIF: "chat.send_gif",
  CHAT_SEND_CALL: "chat.send_call",
  CHAT_SEND_STICKER: "chat.send_sticker",

  // USER
  USER_UPDATE_PROFILE: "user.update_profile",
  USER_FETCH_PROFILE: "user.fetch_profile",

  POST_CREATE : "post.create",

} as const;

export type ActionType = typeof Actions[keyof typeof Actions];