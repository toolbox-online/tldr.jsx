// Workaround because mixpanel.cjs.js doesn't pass flow-checks
// import Mixpanel from 'mixpanel-browser/dist/mixpanel.cjs.js'
const Mixpanel = ()=>{
  return <div>{/* 广告位 */}</div>;
};
export default Mixpanel
