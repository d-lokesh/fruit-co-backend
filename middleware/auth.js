const admin = require('firebase-admin');
require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: 'fruitco-83d20',
    private_key_id: '6bdf94e2803a474d123c316a1fcc0fe0b336bef3',
    private_key: '-----BEGIN PRIVATE KEY-----MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCs1LbXPBNitkuTk86m/M26Olz4n0PLd7zsDutcSN163/iG1Ad+u/mGVP/wPZz75v09XIZncD+U3Gwv29sie3T+BI6QzZMZ2M1AvJU73172nbGdFZ4Lm6BNz0pe7fRgBxl8vLIBPtl7h/HR8LskmMrwmWMgnhO7UpXF9CsgJOuoJocDlQGmmqq1TZHdqrj22VwNtkO//LQDY0P1\n7/hgCaaVc+fjRSGOzMg+f6AlQDcnWLozqE0ZQMy6KVideRVPVBVjASi18U/3Xo/gEaKjV4Ooye5hCkzHo+1Qs1ybeJNiuXRYiUWOt6EsRDgtpkZWPq/fUiE4jv4nvWMdxCxaTis/AgMBAAECggEAIg62yxo1Db4zjWzSi7iEh96pZHrp/qXlTjUwbxqSvnx1Ooh8w54iMTT9zGcv0Ln3jEh32dlWRizbiuDNwXFHoCjguSsxgiXlaIzg8Y/2ZC22CujwIIR15e9jzeohPm0Xuitq/nDWpY+n+QFxt2f+kcQAMzTDWaYQCpaviuGLqLI/XkY750DwvnstgehRcKgUMYQIJyhA+g5LqqOFeBbNkM6NiTKLoQhax5dxzUpNkP3WqGg5WHE0LECFQym6rtCx090hyFxpr6b88K0x8CvO9xRX/ALVWUyWMB8R7eR4HeKSpPJIeDE+aMJTUtMFKr0hpLu4PQXCQgEu4fMcYZZHbQKBgQDuE+mrP44Ktw7dQInvDtLdfMWOyCDpEVNDdUOycnTgIgvWteja+b8GJK8HsIyfApFcqA4jZCe9pWl07ras\njCLfw5gxEyweP/kJripXTtN7Ky/XfsIZXa4FRHs0yDcCdJNtNo3t3HdGiaCkx6pJOyhNMG8wBFUDkKxdNObOW1Gt2wKBgQC512eAMus0OAKBF8tWDZ5jfxXhiSaXSpri\nmfaEUVfjA1tBPgKILxD+NtSuXXyyv/FTumz7ZfmEzIWUp+ks7847Y9LoH+1DyxtW\nAzz8RSDjKCZuxUj6CNczjFaQA5NvAbMqLcmjjFsphkmytxoR3WxPKRYLrqvVtGzQ\ncfpzTS7/bQKBgQDI16WdoPz8DxgMEKEMOg4raVHkNPKGi+YZF3jntmTgm/guxsFM0bmTviimLQtELU9hwihDNP/NnhiL28HhaEsXSBNA+zKRxlgaEYKIquf/lRxECBxId94RdYcWrPyzJpMkZAxxqDY7HGmX+RSvuKc0DvMNp+nsGwU9kB5R4XnTVwKBgBojpBkyEEceAawqrp0B+V9BRtCcO+NXyQVKZpQh5Ny3YiSBFlYVWKyJBc0otRtnSAhg1mdd5oS5R6irHW8Go9lSpx2jL/ozHTsx5WgOSRvqT82Qzjzs9Wf4u0wyVJBuisbJ/eyVF1V13/PVMUOGA2/29XTbMqwyXoPLJFEHcC7ZAoGAHawh4dGh0NulggdVlrXNUsECOdYs8j9lAPiIP6CO6mb0FB0cfF9niSDFV9K1bvWcflZiBzwwdNLFH5oy1ekAIzAZHP9bKgTW6abJfaY0hGsDZExVba31WvdLPAyRtpmQ5gIgvZmNCIcwzFnHyqfgGWEuZOzyye2mYZorE2XZ5i8=-----END PRIVATE KEY-----',
    client_email: 'firebase-adminsdk-sg0cr@fruitco-83d20.iam.gserviceaccount.com',
    client_id: '109012306460102602556',
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs"  }),
});

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log('No authorization header found');
    return res.status(401).send({ message: 'Unauthorized' });
  }

  const idToken = authHeader.split(' ')[1];
  console.log('Authorization token:', idToken);

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    // console.log('Token verified:', decodedToken);
    next();
  } catch (error) {
    console.log('Error verifying token:', error);
    return res.status(401).send({ message: 'Unauthorized' });
  }
};
