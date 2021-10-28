import { SurveyModel } from '@/domain/models/Survey'


export interface LoadSuveyByIdRepository {
  loadById(id: string): Promise<SurveyModel>
}