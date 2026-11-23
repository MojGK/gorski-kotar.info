import tempfile
import os
import unittest
from datetime import datetime
from contextlib import redirect_stdout
from io import StringIO
from pathlib import Path
from unittest.mock import patch

from _automation import publish


class NewsTests(unittest.TestCase):
    def setUp(self):
        self.now = datetime(2026, 11, 23, 20, tzinfo=publish.ZAGREB)
        self.source = {"name": "Test", "url": "https://example.org/feed/",
                       "hosts": ["example.org"], "auto": True}
        self.summary = ("U Delnicama je otvorena obnovljena knjižnica. Obnova je obuhvatila "
                        "čitaonicu te prostor za radionice i kulturna zbivanja.")
        self.item = publish.Item("Obnovljena knjižnica otvorena u Delnicama",
                                 "https://example.org/knjiznica", self.summary,
                                 "Test", "Delnice", True, self.now)
        self.draft = {"eligible": True, "title": "Knjižnica ponovno otvorila vrata",
                      "excerpt": "Posjetitelji mogu koristiti obnovljene prostore.",
                      "body": "Knjižnica u Delnicama opet je otvorena. Obnovom su uređene čitaonica i prostorije namijenjene radionicama i kulturnim sadržajima.",
                      "type": "Kultura"}

    def test_rss_atom_and_source_validation(self):
        rss = f"""<rss><channel><item><title>{self.item.title}</title>
        <link>https://example.org/knjiznica/?utm_source=rss</link>
        <description>{self.summary}</description>
        <pubDate>Mon, 23 Nov 2026 12:00:00 +0100</pubDate></item></channel></rss>"""
        atom = f"""<feed xmlns="http://www.w3.org/2005/Atom"><entry>
        <title>{self.item.title}</title><link href="/knjiznica"/>
        <summary>{self.summary}</summary><published>2026-11-23T12:00:00+01:00</published>
        </entry></feed>"""
        for feed in (rss, atom):
            result, = publish.items(feed.encode(), self.source, self.now)
            self.assertEqual(result.url, self.item.url)
            self.assertEqual(result.location, "Delnice")
        for value in (rss.replace("example.org", "elsewhere.org"),
                      rss.replace("23 Nov", "10 Nov"), rss.replace("23 Nov", "24 Nov")):
            self.assertEqual(list(publish.items(value.encode(), self.source, self.now)), [])

    def test_legacy_and_generated_duplicates(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp)
            (path / "legacy.md").write_text(
                "---\ntitle: Obnovljena knjižnica otvorena u Delnicama\n---\n")
            index = publish.index_posts(path)
            self.assertTrue(publish.duplicate(self.item, index))
            (path / "legacy.md").unlink()
            name, body = publish.render(self.item, self.draft, self.now)
            (path / name).write_text(body)
            index = publish.index_posts(path)
            self.assertIn(self.item.url, index[1])
            self.assertIn(self.item.title, index[0])
            self.assertTrue(publish.duplicate(self.item, index))
            self.assertIn('categories: ["Delnice", "Kultura"]', body)

    def test_preview_and_publish_rerun(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "_posts").mkdir()
            (root / "_automation").mkdir()
            (root / "_automation/sources.json").write_text('[{"name":"Test","url":"https://example.org/feed/","hosts":["example.org"],"auto":true}]')
            preview = root / "preview"
            with (patch.object(publish, "ROOT", root),
                  patch.dict(os.environ, {"OPENAI_API_KEY": "test"}),
                  patch.object(publish, "fetch", return_value=b"fixture"),
                  patch.object(publish, "items", return_value=[self.item]),
                  patch.object(publish, "write_article", return_value=self.draft) as writer,
                  redirect_stdout(StringIO())):
                with patch("sys.argv", ["publish", "--preview-dir", str(preview)]):
                    publish.main()
                self.assertEqual(len(list(preview.glob("*.md"))), 1)
                self.assertEqual(list((root / "_posts").iterdir()), [])
                with patch("sys.argv", ["publish", "--publish"]):
                    publish.main()
                    publish.main()
                self.assertEqual(len(list((root / "_posts").glob("*.md"))), 1)
                self.assertEqual(writer.call_count, 2)

    def test_ai_requires_approval_and_rejects_markup(self):
        with patch.object(publish, "ask_ai", side_effect=[dict(self.draft), {"approved": True}]):
            self.assertEqual(publish.write_article(self.item, "test"), self.draft)
        with patch.object(publish, "ask_ai", side_effect=[dict(self.draft), {"approved": False}]):
            self.assertIsNone(publish.write_article(self.item, "test"))
        with patch.object(publish, "ask_ai", return_value={**self.draft, "body": "{% include x %}"}):
            self.assertIsNone(publish.write_article(self.item, "test"))


if __name__ == "__main__":
    unittest.main()
