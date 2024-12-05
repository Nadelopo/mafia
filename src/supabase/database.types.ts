export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type GameRole = {
  id: number
  count: number
}

export type Database = {
  public: {
    Tables: {
      actions: {
        Row: {
          created_at: string
          gameId: number
          id: number
          playerId: number | null
          targetId: string | null
          turn: number
        }
        Insert: {
          created_at?: string
          gameId: number
          id?: number
          playerId?: number | null
          targetId?: string | null
          turn: number
        }
        Update: {
          created_at?: string
          gameId?: number
          id?: number
          playerId?: number | null
          targetId?: string | null
          turn?: number
        }
        Relationships: [
          {
            foreignKeyName: 'actions_gameId_fkey'
            columns: ['gameId']
            isOneToOne: false
            referencedRelation: 'games'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'actions_playerId_fkey'
            columns: ['playerId']
            isOneToOne: false
            referencedRelation: 'game_players'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'actions_targetId_fkey'
            columns: ['targetId']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      game_players: {
        Row: {
          created_at: string
          gameId: number
          id: number
          roleId: number | null
          status: Database['public']['Enums']['game_player_status']
          userId: string
        }
        Insert: {
          created_at?: string
          gameId: number
          id?: number
          roleId?: number | null
          status: Database['public']['Enums']['game_player_status']
          userId: string
        }
        Update: {
          created_at?: string
          gameId?: number
          id?: number
          roleId?: number | null
          status?: Database['public']['Enums']['game_player_status']
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: 'game_players_gameId_fkey'
            columns: ['gameId']
            isOneToOne: false
            referencedRelation: 'games'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'game_players_roleId_fkey'
            columns: ['roleId']
            isOneToOne: false
            referencedRelation: 'roles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'game_players_userId_fkey'
            columns: ['userId']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      games: {
        Row: {
          created_at: string
          id: number
          leaderId: string
          maxPlayers: number
          roles: GameRole[]
          gameActive: boolean
        }
        Insert: {
          created_at?: string
          id?: number
          leaderId: string
          maxPlayers: number
          roles?: GameRole[]
          gameActive?: boolean
        }
        Update: {
          created_at?: string
          id?: number
          leaderId?: string
          maxPlayers?: number
          roles?: GameRole[]
          gameActive?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'games_leaderId_fkey'
            columns: ['leaderId']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      roles: {
        Row: {
          abilities: string
          created_at: string
          description: string
          id: number
          title: string
          isRoleDark: boolean
        }
        Insert: {
          abilities: string
          created_at?: string
          description: string
          id?: number
          title: string
          isRoleDark?: boolean
        }
        Update: {
          abilities?: string
          created_at?: string
          description?: string
          id?: number
          title?: string
          isRoleDark?: boolean
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      game_player_status: 'killed' | 'prison' | 'play'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type Table = keyof Database['public']['Tables']

export type TablesRow<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Row: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Row: infer I
      }
      ? I
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never
