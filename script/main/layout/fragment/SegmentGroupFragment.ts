class SegmentGroupFragment extends HorizontalScrollFragment {
	override readonly TYPE: string = "SegmentGroupFragment";
	override resetContainer() {
		super.resetContainer();
		let container = this.getContainer();
		container.setLayoutParams(new android.view.ViewGroup.LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.WRAP_CONTENT));
		let scroll = this.getContainerScroll();
		scroll.setLayoutParams(new android.widget.FrameLayout.LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.WRAP_CONTENT));
		scroll.setFillViewport(true);
		let layout = this.getContainerLayout();
		layout.setLayoutParams(new android.widget.FrameLayout.LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.WRAP_CONTENT));
	}
	override addViewDirectly(view: android.view.View, params?: android.view.ViewGroup.LayoutParams) {
		if (params == null) {
			params = new android.widget.LinearLayout.LayoutParams($.ViewGroup.LayoutParams.MATCH_PARENT, $.ViewGroup.LayoutParams.WRAP_CONTENT);
			(params as android.widget.LinearLayout.LayoutParams).weight = 1;
		}
		super.addViewDirectly(view, params);
	}
}

namespace SegmentGroupFragment {
	export function parseJson<RT extends SegmentGroupFragment = SegmentGroupFragment, JT extends ISegmentGroupFragment = ISegmentGroupFragment>(json?: JT): RT;
	export function parseJson<RT extends SegmentGroupFragment = SegmentGroupFragment, JT extends ISegmentGroupFragment = ISegmentGroupFragment>(instance: RT, json?: JT, preferredFragment?: string): RT;
	export function parseJson<RT extends SegmentGroupFragment = SegmentGroupFragment, JT extends ISegmentGroupFragment = ISegmentGroupFragment>(instanceOrJson: RT | JT, json?: JT, preferredFragment?: string) {
		if (!(instanceOrJson instanceof SegmentGroupFragment)) {
			json = instanceOrJson;
			instanceOrJson = new SegmentGroupFragment() as RT;
		}
		instanceOrJson = HorizontalScrollFragment.parseJson.call(this, instanceOrJson, json, preferredFragment !== undefined ? preferredFragment : "button");
		json = calloutOrParse(this, json, instanceOrJson);
		if (json === null || typeof json != "object") {
			return instanceOrJson;
		}
		SelectableLayoutFragment.parseJson.call(this, instanceOrJson, json);
		return instanceOrJson;
	}
}

__inherit__(SegmentGroupFragment, HorizontalScrollFragment, SelectableLayoutFragment.prototype);

registerFragmentJson("segment_group", SegmentGroupFragment);
registerFragmentJson("segmentGroup", SegmentGroupFragment);
