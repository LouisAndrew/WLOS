import { Metric } from './Metric'

export type Band = {
  /**
   * Id of the band
   */
  id: number
  /**
   * Equivalent weight of the band
   */
  weight: number
  /**
   * Metric of the weight
   */
  metric: Metric.KG | Metric.LBS
}
