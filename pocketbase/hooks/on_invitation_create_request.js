onRecordCreateRequest((e) => {
  // Ensure we don't block re-invites due to custom manual uniqueness checks
  // that might have been enforced in this request hook previously.
  e.next()
}, 'invitations')
