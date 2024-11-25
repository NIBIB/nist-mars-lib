import axios from 'axios'
import {
  type TestSubmissionResult,
  type HierarchicDesignator,
  type MarsHubProvider,
  type HubSubmissionResult
} from 'radx-mars-lib'

interface TestPlanEntry {
  testPlanId: number
  contextId?: number
}

export default class NistHubProvider implements MarsHubProvider {
  get receivingApplicationIdentifier (): HierarchicDesignator {
    return this._providerToValidate.receivingApplicationIdentifier
  }

  get receivingFacilityIdentifier (): HierarchicDesignator {
    return this._providerToValidate.receivingFacilityIdentifier
  }

  get isUsingProduction (): boolean {
    return this._providerToValidate.isUsingProduction
  }

  private _testPlan: string
  async retrieveSubmissionResult (submissionId: string): Promise<HubSubmissionResult> {
    throw Error('Not implemented.  Do NOT DO this')
  }

  async submitTest (hl7Message: any): Promise<TestSubmissionResult> {
    await this._loadTestPlans()

    if (!this._testPlan) {
      const entry = Object.entries(this._testPlansDict)[1]
      this._testPlan = entry[0]
    }

    const entry = this._testPlansDict[this._testPlan]

    const url = `https://hl7v2-gvt.nist.gov/gvt/api/hl7v2/testcontext/${entry.contextId}/validateMessage`
    const body = {
      content: hl7Message,
      contextType: 'Free',
      facilityId: '1223'
    }

    try {
      const response = await axios.post(url, body, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      })

      const jsonData = JSON.parse(response.data.json)
      const warnings: string[] = []
      const errors: string[] = []

      Object.keys(jsonData.detections.Error ?? {}).forEach(key => {
        jsonData.detections.Error[key].forEach((err: any) => {
          errors.push(err.description)
        })
      })
      Object.keys(jsonData.detections.Warning ?? {}).forEach(key => {
        jsonData.detections.Warning[key].forEach((warn: any) => {
          warnings.push(warn.description)
        })
      })

      return {
        id: response.data?.reportId ?? 'NO ID',
        retryable: false,
        successful: jsonData.metaData.validationStatus?.toLowerCase() === 'true',
        errors,
        warnings
      }
      // return response.data
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

  private _testPlansDict: Record<string, TestPlanEntry>
  private readonly _providerToValidate: MarsHubProvider

  constructor (providerToValidate: MarsHubProvider) {
    this._providerToValidate = providerToValidate
    this._testPlansDict = {}
    this._testPlan = ''
  }

  async testPlans (): Promise<string[]> {
    await this._loadTestPlans()
    return Object.keys(this._testPlansDict)
  }

  public async useTestPlan (testPlan: string): Promise<void> {
    await this._loadTestPlans()

    const entry = this._testPlansDict[testPlan]
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!entry) {
      throw new Error(`Test plan '${testPlan}' not found`)
    }
    if (entry.contextId == null) {
      throw new Error(`Context ID not found for test plan '${testPlan}'`)
    }

    this._testPlan = testPlan
  }

  private async _loadTestPlans (): Promise<void> {
    if (Object.entries(this._testPlansDict).length > 0) {
      return
    }
    // Fetch the list of test plans
    const testPlansResponse = await axios.get(
      'https://hl7v2-gvt.nist.gov/gvt/api/cf/testplans?domain=nih-otc-covid-19'
    )
    const testPlans = testPlansResponse.data

    for (const testPlan of testPlans) {
      const name = testPlan.name
      const id = testPlan.id

      // Initialize the dictionary entry
      this._testPlansDict[name] = { testPlanId: id }

      // Fetch the test plan details
      const testPlanDetailsResponse = await axios.get(
                `https://hl7v2-gvt.nist.gov/gvt/api/cf/testplans/${id}`
      )
      const testPlanDetails = testPlanDetailsResponse.data

      // Get contextId from testSteps
      if ((Boolean(testPlanDetails.testSteps)) && testPlanDetails.testSteps.length > 0) {
        const testContext = testPlanDetails.testSteps[0].testContext
        if (testContext?.id != null) {
          this._testPlansDict[name].contextId = testContext.id
        } else {
          console.error(`Test context ID not found for test plan '${name}'`)
        }
      } else {
        console.error(`No test steps found for test plan '${name}'`)
      }
    }
  }

  /*
type PrimitiveType = 'string' | 'number' | 'boolean' | 'null' | 'Date'

interface Schema {
  [key: string]: PrimitiveType | Schema | Array<PrimitiveType | Schema>
}

type JsonValue = string | number | boolean | null | JsonObject | JsonArray

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
interface JsonObject {
  [key: string]: JsonValue
}

interface JsonArray extends Array<JsonValue> {}
*/

  /**
   * Generates a simplified schema from a JSON object.
   *
   * @param obj - The JSON object to parse.
   * @returns The generated schema with key-type pairs.
   */
  // private _generateSchema (obj: JsonObject): Schema {
  //   const schema: Schema = {}

  //   for (const key in obj) {
  //     if (Object.prototype.hasOwnProperty.call(obj, key)) {
  //       const value = obj[key]
  //       const valueType: PrimitiveType | 'object' = this.getType(value)

  //       if (valueType === 'object') {
  //         schema[key] = this._generateSchema(value as JsonObject)
  //       } else if (Array.isArray(value)) {
  //         schema[key] = this.handleArray(value)
  //       } else {
  //         schema[key] = valueType
  //       }
  //     }
  //   }

  //   return schema
  // }

  /**
   * Determines the type of a given JSON value.
   *
   * @param value - The JSON value to determine the type of.
   * @returns The type of the value as a string.
   */
  // getType (value: JsonValue): PrimitiveType | 'object' {
  //   if (value === null) {
  //     return 'null'
  //   }

  //   if (value instanceof Date) {
  //     return 'Date'
  //   }

  //   const type = typeof value

  //   switch (type) {
  //     case 'string':
  //       return 'string'
  //     case 'number':
  //       return 'number'
  //     case 'boolean':
  //       return 'boolean'
  //     case 'object':
  //       return 'object'
  //     default:
  //     // For types not covered by JSON (e.g., functions), default to "string"
  //       return 'string'
  //   }
  // }

  /**
 * Handles the schema generation for arrays.
 *
 * @param arr - The JSON array to process.
 * @returns An array representing the schema of the array elements.
 */
  //   handleArray (arr: JsonArray): Array<PrimitiveType | Schema> {
  //     if (arr.length === 0) {
  //       return []
  //     }

  //     const firstElement = arr[0]
  //     const elementType = this.getType(firstElement)

//     if (elementType === 'object') {
//       return [this._generateSchema(firstElement as JsonObject)]
//     } else {
//       return [elementType]
//     }
//   }
}
