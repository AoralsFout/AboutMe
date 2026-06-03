import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(__dirname, '..', '.env') })

export const config = {
  port: Number(process.env.PORT) || 3030,
  steamApiKey: process.env.STEAM_API_KEY || '',
  steamId: process.env.STEAM_ID || '',
  familyGroupId: process.env.FAMILY_GROUP_ID || '',
  fastfetchPath: path.join(__dirname, '..', 'fastfetch.txt'),
}
