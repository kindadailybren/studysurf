const commons = {
  env: {
    account: process.env.AWS_ACCOUNT_ID,
  },
  stage: "staging",
  domainName: process.env.CUSTOM_DOMAIN_NAME || "staging.studysurf.breindel.me",
  certificateArn: process.env.ACM_CERTIFICATE_ARN,
};

const Stateful = {
  ...commons,
  env: {
    ...commons.env,
    region: process.env.AWS_REGION,
  },
  domainName: commons.domainName,
  certificateArn: commons.certificateArn,
};

const Stateless = {
  ...commons,
  env: {
    ...commons.env,
    region: process.env.AWS_REGION,
  },
  customDomainName: commons.domainName,
};

export default {
  commons,
  Stateful,
  Stateless,
};
