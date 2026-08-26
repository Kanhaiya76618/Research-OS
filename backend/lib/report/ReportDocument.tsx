import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { StudentRecord } from '../orchestrator/knowledgeGraph';
import type { SupervisorReport } from '../agents/supervisorAgent';

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 10, padding: 40, paddingBottom: 56, color: '#0c2340' },
  title: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#0c2340', marginBottom: 2 },
  meta: { fontSize: 8, color: '#64748b', marginBottom: 16 },
  sectionTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#0284c7', marginTop: 14, marginBottom: 4 },
  body: { lineHeight: 1.5, color: '#334155' },
  bullet: { flexDirection: 'row', marginBottom: 2 },
  bulletDot: { width: 10, color: '#0284c7' },
  bulletText: { flex: 1, lineHeight: 1.4, color: '#334155' },
  itemTitle: { fontFamily: 'Helvetica-Bold', marginTop: 6, color: '#0c2340' },
  subtle: { color: '#64748b' },
  empty: { color: '#94a3b8', fontStyle: 'italic' },
  badge: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#059669', marginBottom: 6 },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
    fontSize: 7,
    color: '#94a3b8',
    textAlign: 'center',
  },
});

function Bullets({ items, empty }: { items?: string[]; empty: string }) {
  const safeItems = items || [];
  if (safeItems.length === 0) return <Text style={styles.empty}>{empty}</Text>;
  return (
    <View>
      {safeItems.map((item, i) => (
        <View key={i} style={styles.bullet}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export function ReportDocument({
  record,
  supervisor,
}: {
  record: StudentRecord;
  supervisor: SupervisorReport;
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>RiskOS — Counterparty Due Diligence Dossier</Text>
        <Text style={styles.badge}>Track 2: AI Risk Manager (Razorpay)</Text>
        <Text style={styles.meta}>
          Counterparty / Auditor ID: {record.studentId} · Generated: {supervisor.generatedAt}
        </Text>

        <Text style={styles.sectionTitle}>Chief Risk Officer (CRO) Executive Directive</Text>
        <Text style={styles.body}>{supervisor.croSignOffDirective || supervisor.executiveSummary || supervisor.overallNarrative}</Text>

        <Text style={styles.sectionTitle}>Cross-Module Risk Syntheses</Text>
        <Bullets items={supervisor.crossModuleRiskSyntheses || supervisor.consistencyNotes} empty="Zero cross-module conflicts detected." />

        <Text style={styles.sectionTitle}>Mandatory Onboarding Remediations</Text>
        <Bullets items={supervisor.mandatoryRemediations || supervisor.suggestions} empty="No mandatory escrow or contractual riders required." />

        <Text style={styles.sectionTitle}>4-Tier Due Diligence Verification Trail</Text>
        {record.learningPaths.length === 0 ? (
          <Text style={styles.empty}>No verification trails generated.</Text>
        ) : (
          record.learningPaths.map((lp: any, i) => (
            <View key={i}>
              <Text style={styles.itemTitle}>{lp.targetVendor || lp.targetTitle}</Text>
              <Text style={styles.subtle}>{(lp.nodes || []).map((n: any) => `${n.tier || ''}: ${n.title}`).join(' → ')}</Text>
            </View>
          ))
        )}

        <Text style={styles.sectionTitle}>Red-Flag Contract & Security Audits</Text>
        {record.critiques.length === 0 ? (
          <Text style={styles.empty}>No contracts audited yet.</Text>
        ) : (
          record.critiques.map((c: any, i) => (
            <View key={i}>
              <Text style={styles.itemTitle}>{c.overallComplianceSummary || c.structureSummary}</Text>
              <Bullets
                items={(c.flags || []).map((f: any) => `[${f.category || f.type} · ${f.severity}] ${f.hazardNote || f.note || ''}`)}
                empty="No red flags identified."
              />
            </View>
          ))
        )}

        <Text style={styles.sectionTitle}>Historical Incident Memory Matches</Text>
        {record.archiveEntries.length === 0 ? (
          <Text style={styles.empty}>No matching historical fraud patterns.</Text>
        ) : (
          record.archiveEntries.map((e: any, i) => (
            <View key={i}>
              <Text style={styles.itemTitle}>{e.vendorOrIncident || e.attempted}</Text>
              <Text style={styles.body}>
                Hazard: {e.failureMode}. Remediation Lesson: {e.lesson}
              </Text>
            </View>
          ))
        )}

        <Text style={styles.footer} fixed>
          RiskOS by Razorpay · Autonomous Multi-Agent Risk Intelligence Dossier
        </Text>
      </Page>
    </Document>
  );
}

