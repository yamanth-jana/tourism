import { useState } from 'react';
import {
  Check, X as XIcon, Eye, FileText, Mail, Phone, Award, Languages, MapPin,
  Building2, Calendar, MessageSquare, ShieldCheck, Wallet,
} from 'lucide-react';
import {
  REGISTRATION_STATUS, VERIFICATION_BADGES,
} from '../../data/guideRegistrations';
import { useNotifications } from '../../context/NotificationContext';
import { useGuideRequests } from '../../context/GuideRequestsContext';

function StatusBadge({ status }) {
  const cfg = REGISTRATION_STATUS[status] || REGISTRATION_STATUS.pending;
  return (
    <span className={`badge ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} /> {cfg.label}
    </span>
  );
}

function DocumentPreview({ doc }) {
  const [open, setOpen] = useState(false);
  const isImage = doc.type === 'image' && doc.url && doc.url !== '#';
  return (
    <div className="rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 p-3 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors text-left"
      >
        {isImage ? (
          <img src={doc.url} alt={doc.name} className="w-10 h-10 rounded-lg object-cover" loading="lazy" />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center">
            <FileText size={18} className="text-primary-500" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-stone-900 dark:text-white truncate">{doc.name}</p>
          <p className="text-xs text-stone-500 dark:text-stone-400">{isImage ? 'Image' : 'Document'}</p>
        </div>
        <Eye size={16} className="text-stone-400" />
      </button>
      {open && isImage && (
        <div className="p-3 border-t border-stone-200 dark:border-stone-700">
          <img src={doc.url} alt={doc.name} className="w-full rounded-xl" />
        </div>
      )}
    </div>
  );
}

function RequestDetailModal({ request, onClose, onAction }) {
  const [action, setAction] = useState(null); // 'approve' | 'reject' | 'more_info'
  const [comment, setComment] = useState('');

  if (!request) return null;

  const handleConfirm = () => {
    onAction(request.id, action, comment);
    setAction(null);
    setComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="glass-card p-0 max-w-2xl w-full max-h-[85vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 glass-nav px-6 py-4 flex items-center justify-between border-b border-white/40 dark:border-white/10 z-10">
          <div className="flex items-center gap-3">
            <img src={request.profilePhoto} alt={request.fullName} className="w-12 h-12 rounded-xl object-cover" loading="lazy" />
            <div>
              <h3 className="font-bold text-stone-900 dark:text-white">{request.fullName}</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">{request.guideTypeLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={request.status} />
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500">
              <XIcon size={18} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {request.organization && request.organization !== '—' && (
              <div className="flex items-center gap-2 text-sm">
                <Building2 size={15} className="text-stone-400" />
                <span className="text-stone-500 dark:text-stone-400">{request.organization}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Phone size={15} className="text-stone-400" />
              <span className="text-stone-500 dark:text-stone-400">{request.mobile}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail size={15} className="text-stone-400" />
              <span className="text-stone-500 dark:text-stone-400">{request.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Award size={15} className="text-stone-400" />
              <span className="text-stone-500 dark:text-stone-400">{request.experience}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Languages size={15} className="text-stone-400" />
              <span className="text-stone-500 dark:text-stone-400">{request.languages.join(', ')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={15} className="text-stone-400" />
              <span className="text-stone-500 dark:text-stone-400">{request.areasCovered.join(', ')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Wallet size={15} className="text-stone-400" />
              <span className="text-stone-500 dark:text-stone-400">{request.dailyCharges}/day</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={15} className="text-stone-400" />
              <span className="text-stone-500 dark:text-stone-400">Submitted {request.submittedDate}</span>
            </div>
          </div>

          {request.specialization && (
            <div>
              <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 mb-1">Specialization</p>
              <p className="text-sm text-stone-700 dark:text-stone-300">{request.specialization}</p>
            </div>
          )}

          {/* Documents */}
          <div>
            <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 mb-2">Submitted Documents</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {request.documents.map((doc, idx) => (
                <DocumentPreview key={idx} doc={doc} />
              ))}
            </div>
          </div>

          {/* Admin comments */}
          {request.adminComments && (
            <div className="rounded-2xl bg-primary-50/60 dark:bg-primary-500/10 p-4">
              <p className="text-xs font-semibold text-primary-700 dark:text-primary-300 mb-1 flex items-center gap-1">
                <MessageSquare size={13} /> Admin Comments
              </p>
              <p className="text-sm text-stone-700 dark:text-stone-300">{request.adminComments}</p>
            </div>
          )}

          {/* Action panel */}
          {request.status !== 'verified' && (
            <div className="border-t border-stone-200 dark:border-stone-700 pt-4">
              {action ? (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-stone-900 dark:text-white">
                    {action === 'approve' && 'Approve this application?'}
                    {action === 'reject' && 'Reject this application'}
                    {action === 'more_info' && 'Request more information'}
                  </p>
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={
                      action === 'approve' ? 'Optional approval note...' :
                      action === 'reject' ? 'Enter rejection reason...' :
                      'Describe what information is needed...'
                    }
                    className="input-field resize-none"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleConfirm} className={`btn-primary text-sm ${action === 'approve' ? 'bg-success-500' : ''}`} style={action === 'approve' ? { background: 'var(--tw-gradient-from, #22c55e)' } : {}}>
                      Confirm
                    </button>
                    <button onClick={() => { setAction(null); setComment(''); }} className="btn-ghost text-sm">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setAction('approve')} className="px-4 py-2 rounded-full bg-success-500 text-white text-sm font-semibold flex items-center gap-1 hover:bg-success-600 transition-colors">
                    <Check size={16} /> Approve
                  </button>
                  <button onClick={() => setAction('reject')} className="px-4 py-2 rounded-full bg-error-500 text-white text-sm font-semibold flex items-center gap-1 hover:bg-error-600 transition-colors">
                    <XIcon size={16} /> Reject
                  </button>
                  <button onClick={() => setAction('more_info')} className="px-4 py-2 rounded-full bg-primary-500 text-white text-sm font-semibold flex items-center gap-1 hover:bg-primary-600 transition-colors">
                    <MessageSquare size={16} /> Request More Information
                  </button>
                </div>
              )}
            </div>
          )}

          {request.status === 'verified' && (
            <div className="rounded-2xl bg-success-50 dark:bg-success-500/10 p-4 flex items-center gap-3">
              <ShieldCheck size={20} className="text-success-500" />
              <div>
                <p className="text-sm font-semibold text-success-700 dark:text-success-300">Approved</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">Badge: {VERIFICATION_BADGES[request.guideType]}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GuideRegistrationRequests() {
  const { addNotification } = useNotifications();
  const { requests, updateRequest } = useGuideRequests();
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? requests : requests.filter((r) => r.status === filter);

  const handleAction = (id, action, comment) => {
    let status = 'pending';
    let adminComments = comment || '';
    if (action === 'approve') {
      status = 'verified';
      adminComments = comment || 'All documents verified. Welcome aboard!';
      addNotification('approved', 'Application Approved', 'Congratulations! Your guide registration has been approved. Your profile is now visible to tourists.', 'user');
      addNotification('admin_rejected', 'Application Approved', `Guide application from ${requests.find((r) => r.id === id)?.fullName} has been approved.`, 'admin');
    } else if (action === 'reject') {
      status = 'rejected';
      adminComments = comment || 'Application rejected.';
      addNotification('rejected', 'Application Rejected', `Your guide registration has been rejected. Reason: ${comment || 'Documents did not meet requirements.'}`, 'user');
      addNotification('admin_rejected', 'Application Rejected', `Guide application from ${requests.find((r) => r.id === id)?.fullName} has been rejected.`, 'admin');
    } else if (action === 'more_info') {
      status = 'needs_info';
      adminComments = comment;
      addNotification('more_info', 'More Information Requested', `The admin team needs more information: ${comment}`, 'user');
      addNotification('admin_more_info', 'More Information Requested', `More information requested for ${requests.find((r) => r.id === id)?.fullName}'s application.`, 'admin');
    }
    updateRequest(id, { status, adminComments });
    setSelected(null);
  };

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    needs_info: requests.filter((r) => r.status === 'needs_info').length,
    verified: requests.filter((r) => r.status === 'verified').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-bold text-stone-900 dark:text-white">Guide Registration Requests</h2>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          {[
            { id: 'all', label: 'All' },
            { id: 'pending', label: 'Pending' },
            { id: 'needs_info', label: 'Needs Info' },
            { id: 'verified', label: 'Verified' },
            { id: 'rejected', label: 'Rejected' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === f.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {f.label} ({counts[f.id]})
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <MessageSquare size={40} className="mx-auto text-stone-400 mb-3" />
          <p className="text-stone-500 dark:text-stone-400">No applications in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((req) => (
            <div key={req.id} className="glass-card p-5">
              <div className="flex items-start gap-4">
                <img src={req.profilePhoto} alt={req.fullName} className="w-14 h-14 rounded-2xl object-cover shrink-0" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-stone-900 dark:text-white truncate">{req.fullName}</h4>
                    <StatusBadge status={req.status} />
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{req.guideTypeLabel}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
                  <Phone size={12} className="text-stone-400" /> {req.mobile}
                </div>
                <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
                  <Award size={12} className="text-stone-400" /> {req.experience}
                </div>
                <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400 col-span-2">
                  <Mail size={12} className="text-stone-400" /> {req.email}
                </div>
                {req.organization && req.organization !== '—' && (
                  <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400 col-span-2">
                    <Building2 size={12} className="text-stone-400" /> {req.organization}
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400 col-span-2">
                  <Languages size={12} className="text-stone-400" /> {req.languages.join(', ')}
                </div>
                <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400 col-span-2">
                  <MapPin size={12} className="text-stone-400" /> {req.areasCovered.join(', ')}
                </div>
                <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
                  <Calendar size={12} className="text-stone-400" /> {req.submittedDate}
                </div>
                <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
                  <FileText size={12} className="text-stone-400" /> {req.documents.length} docs
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-stone-200/60 dark:border-stone-700/50">
                <button onClick={() => setSelected(req)} className="flex-1 px-3 py-2 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-sm font-semibold flex items-center justify-center gap-1 hover:bg-primary-500 hover:text-white transition-all">
                  <Eye size={15} /> View Details
                </button>
                {req.status !== 'verified' && (
                  <>
                    <button onClick={() => { setSelected(req); }} className="px-3 py-2 rounded-full bg-success-500/10 text-success-600 dark:text-success-400 text-sm font-semibold flex items-center justify-center gap-1 hover:bg-success-500 hover:text-white transition-all" title="Approve">
                      <Check size={15} />
                    </button>
                    <button onClick={() => { setSelected(req); }} className="px-3 py-2 rounded-full bg-error-500/10 text-error-600 dark:text-error-400 text-sm font-semibold flex items-center justify-center gap-1 hover:bg-error-500 hover:text-white transition-all" title="Reject">
                      <XIcon size={15} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <RequestDetailModal
          request={requests.find((r) => r.id === selected.id) || selected}
          onClose={() => setSelected(null)}
          onAction={handleAction}
        />
      )}
    </div>
  );
}
