import axios from 'axios'

interface TestPlanEntry {
  testPlanId: number
  contextId?: number
}

class HL7Validator {
  private testPlansDict: Record<string, TestPlanEntry>

  constructor () {
    this.testPlansDict = {}
  }

  public async initialize (): Promise<void> {
    // Fetch the list of test plans
    const testPlansResponse = await axios.get(
      'https://hl7v2-gvt.nist.gov/gvt/api/cf/testplans?domain=nih-otc-covid-19'
    )
    const testPlans = testPlansResponse.data

    for (const testPlan of testPlans) {
      const name = testPlan.name
      const id = testPlan.id

      // Initialize the dictionary entry
      this.testPlansDict[name] = { testPlanId: id }

      // Fetch the test plan details
      const testPlanDetailsResponse = await axios.get(
                `https://hl7v2-gvt.nist.gov/gvt/api/cf/testplans/${id}`
      )
      const testPlanDetails = testPlanDetailsResponse.data

      // Get contextId from testSteps
      if ((Boolean(testPlanDetails.testSteps)) && testPlanDetails.testSteps.length > 0) {
        const testContext = testPlanDetails.testSteps[0].testContext
        if (testContext?.id != null) {
          this.testPlansDict[name].contextId = testContext.id
        } else {
          console.error(`Test context ID not found for test plan '${name}'`)
        }
      } else {
        console.error(`No test steps found for test plan '${name}'`)
      }
    }
  }

  public get testPlans (): string[] {
    return Object.keys(this.testPlansDict)
  }

  public async validate (testPlanName: string, message: string): Promise<any> {
    const entry = this.testPlansDict[testPlanName]
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!entry) {
      throw new Error(`Test plan '${testPlanName}' not found`)
    }
    if (entry.contextId == null) {
      throw new Error(`Context ID not found for test plan '${testPlanName}'`)
    }

    const url = `https://hl7v2-gvt.nist.gov/gvt/api/hl7v2/testcontext/${entry.contextId}/validateMessage`
    const body = {
      content: message,
      contextType: 'Free'
    }

    try {
      const response = await axios.post(url, body, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      })

      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with a status code outside the 2xx range
          throw new Error(
            `Validation request failed: ${error.response.status} ${error.response.statusText}: ${JSON.stringify(
                error.response.data
            )}`
          )
        } else if (error.request != null) {
          // Request was made but no response received
          throw new Error(`No response received: ${error.message}`)
        } else {
          // Error setting up the request
          throw new Error(`Error in request setup: ${error.message}`)
        }
      } else {
        // Non-Axios error
        throw error
      }
    }
  }
}

export default HL7Validator
