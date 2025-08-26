const { pool } = require("../infrastructure/PgDB/connect");

class TherapeuticTrialOverviewRepository {
  constructor(dbPool = pool) {
    this.pool = dbPool;
  }

  async create(data) {
    const query = `
      INSERT INTO "therapeutic_trial_overview" (
        therapeutic_area, trial_identifier, trial_phase, status, primary_drugs, other_drugs,
        title, disease_type, patient_segment, line_of_therapy, reference_links, trial_tags,
        sponsor_collaborators, sponsor_field_activity, associated_cro, countries, region,
        trial_record_status
      ) VALUES (
        $1,$2,$3,$4,$5,$6,
        $7,$8,$9,$10,$11,$12,
        $13,$14,$15,$16,$17,$18
      ) RETURNING *
    `;
    const values = [
      data.therapeutic_area || null,
      data.trial_identifier || null,
      data.trial_phase || null,
      data.status || null,
      data.primary_drugs || null,
      data.other_drugs || null,
      data.title || null,
      data.disease_type || null,
      data.patient_segment || null,
      data.line_of_therapy || null,
      data.reference_links || null,
      data.trial_tags || null,
      data.sponsor_collaborators || null,
      data.sponsor_field_activity || null,
      data.associated_cro || null,
      data.countries || null,
      data.region || null,
      data.trial_record_status || null,
    ];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async createWithClient(client, data) {
    const query = `
      INSERT INTO "therapeutic_trial_overview" (
        therapeutic_area, trial_identifier, trial_phase, status, primary_drugs, other_drugs,
        title, disease_type, patient_segment, line_of_therapy, reference_links, trial_tags,
        sponsor_collaborators, sponsor_field_activity, associated_cro, countries, region,
        trial_record_status
      ) VALUES (
        $1,$2,$3,$4,$5,$6,
        $7,$8,$9,$10,$11,$12,
        $13,$14,$15,$16,$17,$18
      ) RETURNING *
    `;
    const values = [
      data.therapeutic_area || null,
      data.trial_identifier || null,
      data.trial_phase || null,
      data.status || null,
      data.primary_drugs || null,
      data.other_drugs || null,
      data.title || null,
      data.disease_type || null,
      data.patient_segment || null,
      data.line_of_therapy || null,
      data.reference_links || null,
      data.trial_tags || null,
      data.sponsor_collaborators || null,
      data.sponsor_field_activity || null,
      data.associated_cro || null,
      data.countries || null,
      data.region || null,
      data.trial_record_status || null,
    ];
    const result = await client.query(query, values);
    return result.rows[0];
  }

  async findAll() {
    const result = await this.pool.query(
      'SELECT * FROM "therapeutic_trial_overview" ORDER BY created_at DESC'
    );
    return result.rows;
  }

  async findById(id) {
    const result = await this.pool.query(
      'SELECT * FROM "therapeutic_trial_overview" WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async update(id, updates) {
    const entries = Object.entries(updates).filter(([, v]) => v !== undefined);
    if (entries.length === 0) return null;
    const fields = entries.map(([k]) => k);
    const values = entries.map(([, v]) => v);
    const setClause = fields.map((f, idx) => `${f} = $${idx + 2}`).join(", ");
    const query = `UPDATE "therapeutic_trial_overview" SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`;
    const result = await this.pool.query(query, [id, ...values]);
    return result.rows[0] || null;
  }

  async delete(id) {
    const result = await this.pool.query(
      'DELETE FROM "therapeutic_trial_overview" WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rowCount > 0;
  }

  async deleteByTrialId(trialId) {
    const result = await this.pool.query(
      'DELETE FROM "therapeutic_trial_overview" WHERE id = $1 RETURNING id',
      [trialId]
    );
    return result.rowCount;
  }
}

module.exports = { TherapeuticTrialOverviewRepository };
