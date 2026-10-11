import test from 'node:test';
import assert from 'node:assert/strict';
import { feed, feedHint } from '../src/data/feed.js';
import { loops } from '../src/audio/feedLoops.js';

test('unratito: at least three videos before the news, and the news is last', () => {
  const news = feed.findIndex(v => v.news);
  assert.equal(news, feed.length - 1);
  assert.ok(news >= 3);
  assert.equal(feed.filter(v => v.news).length, 1);
});

test('unratito: every video has the data the feed renders', () => {
  const arts = ['dance', 'grandpa', 'sixseven', 'news'];
  assert.equal(new Set(feed.map(v => v.id)).size, feed.length);
  for (const v of feed) {
    for (const key of ['id', 'user', 'caption', 'sound', 'likes', 'comments', 'shares', 'alt', 'avatar']) assert.equal(typeof v[key], 'string', `${v.id}.${key}`);
    assert.ok(Array.isArray(v.tags) && v.tags.length > 0, `${v.id}.tags`);
    assert.ok(v.tags.every(t => !t.startsWith('#')), `${v.id}: hashtags sin #`);
    assert.ok(arts.includes(v.art), `${v.id}.art`);
    assert.ok(loops[v.loop], `${v.id}.loop`);
    assert.ok(v.duration > 0, `${v.id}.duration`);
  }
  const news = feed.at(-1);
  for (const key of ['tag', 'body', 'aside', 'cta']) assert.equal(typeof news[key], 'string');
  assert.ok(Array.isArray(news.title));
  assert.ok(feedHint.swipe && feedHint.keys);
});

test('unratito: audio loops are 16-step patterns', () => {
  for (const [id, p] of Object.entries(loops)) {
    assert.ok(p.bpm > 0, id);
    for (const part of [p.lead.notes, p.bass.notes, p.kick, p.snare, p.hat]) assert.equal(part.length, 16, id);
  }
});
