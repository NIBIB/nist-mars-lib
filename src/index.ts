/* eslint-disable max-len */
// import HL7Validator from './HL7Validator'

// async function main (): Promise<void> {
//   const validator = new HL7Validator()
//   await validator.initialize()

//   console.log('Available test plans:')
//   console.log(validator.testPlans)

//   // Use a test plan name from the list
//   const testPlanName = 'Production' // Change as needed

//   // Sample HL7 message
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const badMessage = `MSH|^~\\&|ACME_Gateway^080019FFFE3ED02D^EUI-64|ACME Healthcare|||20110602050000+0000||ORU^R01^ORU_R01|0104ef190d604db188c3|P|2.6|||AL|NE||UNICODE UTF-8|||PCD_DEC_001^IHE PCD^1.3.6.1.4.1.19376.1.6.1.1.1^ISO\r
// PID|||HO2009001^^^NIST^PI||Hon^Albert^^^^^L|Adams^^^^^^L|19610101|M|||15 N Saguaro^^Tucson^AZ^85701^^M\r
// PV1||I|HO Surgery^OR^1|\r
// OBR|1|080019FFFE3ED02D20110602045842^ACME_Gateway^080019FFFE3ED02D^EUI-64|080019FFFE3ED02D20110602045842^ACME_Gateway^080019FFFE3ED02D^EUI-64|182777000^monitoring of patient^SCT|||20110602045842+0000\r
// OBX|1||69965^MDC_DEV_MON_PHYSIO_MULTI_PARAM_MDS^MDC|1.0.0.0|||||||X\r
// OBX|2||70686^MDC_DEV_PRESS_BLD_NONINV_VMD^MDC|1.1.0.0|||||||X\r
// OBX|3||70687^MDC_DEV_PRESS_BLD_NONINV_CHAN^MDC|1.1.1.0|||||||X|||20110602045842+0000\r
// OBX|4|NM|150021^MDC_PRESS_BLD_NONINV_SYS^MDC|1.1.1.1|120|mm[Hg]^mm[Hg]^UCUM|||||R|||20110602045842+0000||||080019FFFE3ED02D172.16.172.135^GATEWAY_ACME\r
// OBX|5|NM|150022^MDC_PRESS_BLD_NONINV_DIA^MDC|1.1.1.2|80|mm[Hg]^mm[Hg]^UCUM|||||R|||20110602045842+0000||||080019FFFE3ED02D172.16.172.135^GATEWAY_ACME\r
// OBX|6|NM|150023^MDC_PRESS_BLD_NONINV_MEAN^MDC|1.1.1.3|93|mm[Hg]^mm[Hg]^UCUM|||||R|||20110602045842+0000||||080019FFFE3ED02D172.16.172.135^GATEWAY_ACME\r
// OBX|7|NM|149546^MDC_PULS_RATE_NON_INV^MDC|1.1.1.4|63|{beat}/min^{beat}/min^UCUM|||||R|||20110602045842+0000||||080019FFFE3ED02D172.16.172.135^GATEWAY_ACME`

//   const debugMessage = `MSH|^~\\&|AbbottInformatics^2.16.840.1.113883.3.8589.4.1.22^ISO|AbbottInformatics^00Z0000002^CLIA|AIMS.INTEGRATION.STG^2.16.840.1.114222.4.3.15.2^ISO|AIMS.PLATFORM^2.16.840.1.114222.4.1.217446^ISO|20240924192952-0000||ORU^R01^ORU_R01|20240924192952-0000_Your Test Kit ID|T|2.5.1|||NE|NE|||||PHLabReport-NoAck^ELR251R1_Rcvr_Prof^2.16.840.1.113883.9.11^ISO
// SFT|Meadows Design, LLC|1.0.0|RADx MARS Hub API|1.0.0||
// PID|1||YOUR_PATIENT_ID^^^&2.16.840.1.113883.3.8589.4.1.22&ISO^PI||~^^^^^^S||||||^^^^00000^^^^||^^PH^^^111^1111111|||||||||
// ORC|RE||Your Test Kit ID^^2.16.840.1.113883.3.8589.4.1.22^ISO|||||||||^^SA.Proctor|||||||||SA.Proctor|^^^^00000^^^^|^^PH^^^111^1111111|
// OBR|1||Your Test Kit ID^^2.16.840.1.113883.3.8589.4.1.22^ISO|94558-4^SARS-CoV-2 (COVID-19) Ag [Presence] in Respiratory specimen by Rapid immunoassay^LN^^^^2.71|||20240924192952-0000|||||||||^^SA.Proctor||||||20240924192952-0000|||F
// OBX|1|CWE|94558-4^SARS-CoV-2 (COVID-19) Ag [Presence] in Respiratory specimen by Rapid immunoassay^LN^^^^2.71||260415000^Not Detected^SCT^^^^20210301|||N^Normal^HL70078^^^^2.5.1|||F||||00Z0000016||10811877011337_DIT^^99ELR^^^^Vunknown||20240924192952-0000||||SA.Proctor^^^^^&2.16.840.1.113883.3.8589.4.1.152&ISO^XX^^^00Z0000016|13 Fake AtHome Test Street^^Fake City|
// NTE|1|L|10811877011337_DIT
// OBX|2|NM|35659-2^Age at specimen collection^LN^^^^2.71||28|a^year^UCUM^^^^2.1|||||F||||00Z0000016||||||||SA.Proctor^^^^^&2.16.840.1.113883.3.8589.4.1.152&ISO^XX^^^00Z0000016|13 Fake AtHome Test Street^^Fake City|||||QST
// SPM|1|^Your Test Kit ID&&2.16.840.1.113883.3.8589.4.1.22&ISO||697989009^Anterior nares swab (specimen)^SCT^^^^20210301|||||||||||||20240924192952-0000|20240924192952-0000`
//   try {
//     const result = await validator.validate(testPlanName, debugMessage)
//     console.log('Validation result:')
//     console.log(JSON.stringify(result, null, 2))
//   } catch (error) {
//     console.error('Validation failed:')
//     console.error(error)
//   }
// }

// void main()

import NistHubProvider from './NistHubProvider'

export { NistHubProvider }
