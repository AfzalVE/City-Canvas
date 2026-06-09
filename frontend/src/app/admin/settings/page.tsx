// Metadata import removed for React
import { Settings, Bell, Globe, RefreshCw } from 'lucide-react';

// export const metadata = { title: 'Settings | Admin' };

export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[var(--charcoal)] mb-1">Settings</h1>
        <p className="text-sm text-[var(--warm-gray)]">Configure your content automation platform</p>
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* RSS Settings */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-[var(--forest-green)]/10 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-4 h-4 text-[var(--forest-green)]" />
            </div>
            <h2 className="font-serif text-lg text-[var(--charcoal)]">RSS Agent Settings</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <div className="text-sm font-medium text-[var(--charcoal)]">Auto-fetch interval</div>
                <div className="text-xs text-gray-500">How often the RSS agent runs automatically</div>
              </div>
              <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[var(--forest-green)]">
                <option>Every 4 hours</option>
                <option>Every 6 hours</option>
                <option>Every 12 hours</option>
                <option>Daily</option>
              </select>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <div className="text-sm font-medium text-[var(--charcoal)]">Minimum relevance score</div>
                <div className="text-xs text-gray-500">Articles below this score are filtered out</div>
              </div>
              <input type="number" defaultValue={40} min={0} max={100} className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:border-[var(--forest-green)]" />
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="text-sm font-medium text-[var(--charcoal)]">Auto-advance high-scoring articles</div>
                <div className="text-xs text-gray-500">Articles scoring 80+ skip verification queue</div>
              </div>
              <label className="relative inline-flex cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--forest-green)]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Content Generation */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-[var(--gold)]/10 rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-[var(--gold)]" />
            </div>
            <h2 className="font-serif text-lg text-[var(--charcoal)]">Content Generation</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <div className="text-sm font-medium text-[var(--charcoal)]">Auto-generate on article approval</div>
                <div className="text-xs text-gray-500">Automatically trigger Claude when article is approved</div>
              </div>
              <label className="relative inline-flex cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--forest-green)]"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <div className="text-sm font-medium text-[var(--charcoal)]">Claude Model</div>
                <div className="text-xs text-gray-500">AI model used for content generation</div>
              </div>
              <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[var(--forest-green)]">
                <option value="claude-sonnet-4-5">Claude Sonnet 4.5 (Recommended)</option>
                <option value="claude-opus-4-5">Claude Opus 4.5 (Higher quality)</option>
              </select>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="text-sm font-medium text-[var(--charcoal)]">Generate blog post by default</div>
                <div className="text-xs text-gray-500">Include full blog article in every content batch</div>
              </div>
              <label className="relative inline-flex cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--forest-green)]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="font-serif text-lg text-[var(--charcoal)]">Notifications</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: 'New articles in verification queue', sub: 'Notify when articles need review' },
              { label: 'Content ready for approval', sub: 'Notify when Claude finishes generating' },
              { label: 'Publishing failures', sub: 'Alert when a post fails to publish' },
              { label: 'Weekly digest', sub: 'Summary of all platform performance' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <div className="text-sm font-medium text-[var(--charcoal)]">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.sub}</div>
                </div>
                <label className="relative inline-flex cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--forest-green)]"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Social Connections */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-amber-600" />
            </div>
            <h2 className="font-serif text-lg text-[var(--charcoal)]">Social Platform Connections</h2>
          </div>
          <div className="space-y-3">
            {[
              { platform: 'Instagram', connected: false, desc: 'Connect via Facebook Business Account' },
              { platform: 'LinkedIn', connected: false, desc: 'Connect via LinkedIn OAuth' },
              { platform: 'Facebook', connected: false, desc: 'Connect via Facebook Graph API' },
            ].map((item) => (
              <div key={item.platform} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-[var(--charcoal)]">{item.platform}</div>
                  <div className="text-xs text-gray-500">{item.desc}</div>
                </div>
                <button className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                  item.connected
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-[var(--forest-green)] text-cream-100 hover:bg-[var(--forest-green-light)]'
                }`}>
                  {item.connected ? 'Connected' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button className="btn-primary text-xs">Save All Settings</button>
        </div>
      </div>
    </div>
  );
}
